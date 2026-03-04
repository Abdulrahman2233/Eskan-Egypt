from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
import logging
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    RequestPasswordResetSerializer,
    ResetPasswordSerializer,
)
from .models import UserProfile, PasswordResetToken
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

logger = logging.getLogger(__name__)


class AuthRateThrottle(AnonRateThrottle):
    """Rate limiting for auth endpoints"""
    rate = '20/minute'


class ContactRateThrottle(AnonRateThrottle):
    """Rate limiting for contact message endpoints"""
    rate = '3/minute'

class AuthViewSet(viewsets.ViewSet):
    """
    Authentication ViewSet for Register/Login/Logout/Profile/ChangePassword.
    """
    permission_classes = [IsAuthenticated]

    # ----------- REGISTER ----------------
    @action(detail=False, methods=['post'], permission_classes=[AllowAny], throttle_classes=[AuthRateThrottle])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserSerializer(user).data
                return Response(
                    {
                        'success': True,
                        'message': 'User registered successfully',
                        'user': user_data,
                        'token': token.key,
                    },
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'success': False, 'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------- LOGIN ----------------
    @action(detail=False, methods=['post'], permission_classes=[AllowAny], throttle_classes=[AuthRateThrottle])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            # Prefetch profile in a single query to avoid N+1
            user = User.objects.select_related('profile').get(pk=user.pk)
            token, _ = Token.objects.get_or_create(user=user)
            # Update last login timestamp efficiently
            UserProfile.objects.filter(user=user).update(last_login_at=timezone.now())
            user_data = UserSerializer(user).data
            return Response(
                {
                    'success': True,
                    'message': 'Login successful',
                    'user': user_data,
                    'token': token.key,
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------- LOGOUT ----------------
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Logout user by deleting their auth token.
        """
        try:
            # حذف التوكن لتسجيل الخروج
            request.user.auth_token.delete()
            return Response(
                {
                    'success': True,
                    'message': 'تم تسجيل الخروج بنجاح'
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': 'حدث خطأ أثناء تسجيل الخروج'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # ----------- CHECK USERNAME ----------------
    @action(
        detail=False,
        methods=['get'],
        permission_classes=[AllowAny],
        url_path='check-username'
    )
    def check_username(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'available': False, 'error': 'username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        exists = User.objects.filter(username=username).exists()
        return Response({'available': not exists}, status=status.HTTP_200_OK)

    # ----------- CHECK EMAIL ----------------
    @action(
        detail=False,
        methods=['get'],
        permission_classes=[AllowAny],
        url_path='check-email'
    )
    def check_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'available': False, 'error': 'email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        exists = User.objects.filter(email=email).exists()
        return Response({'available': not exists}, status=status.HTTP_200_OK)

    # ----------- CHANGE PASSWORD ----------------
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='change-password')
    def change_password(self, request):
        """
        Change user password with validation.
        """
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            # Verify old password
            if not user.check_password(serializer.validated_data.get('old_password')):
                return Response(
                    {'success': False, 'error': 'كلمة المرور الحالية غير صحيحة'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(serializer.validated_data.get('new_password'))
            user.save()
            
            return Response(
                {
                    'success': True,
                    'message': 'تم تغيير كلمة المرور بنجاح'
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------- GET/UPDATE PROFILE (ME) ----------------
    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated], url_path='me')
    def me(self, request):
        """
        Get or update current user profile.
        """
        user = request.user
        
        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # PUT request - update profile
        elif request.method == 'PUT':
            # Update user fields
            if 'first_name' in request.data:
                user.first_name = request.data.get('first_name', user.first_name)
            if 'last_name' in request.data:
                user.last_name = request.data.get('last_name', user.last_name)
            if 'email' in request.data:
                user.email = request.data.get('email', user.email)
            
            user.save()
            
            # Update UserProfile fields
            profile = user.profile
            if 'full_name' in request.data:
                profile.full_name = request.data.get('full_name', profile.full_name)
            if 'email' in request.data:
                profile.email = request.data.get('email', profile.email)
            if 'phone_number' in request.data:
                profile.phone_number = request.data.get('phone_number', profile.phone_number)
            if 'date_of_birth' in request.data:
                profile.date_of_birth = request.data.get('date_of_birth', profile.date_of_birth)
            if 'city' in request.data:
                profile.city = request.data.get('city', profile.city)
            
            profile.save()
            
            serializer = UserSerializer(user)
            return Response(
                {
                    'success': True,
                    'message': 'تم تحديث الملف الشخصي بنجاح',
                    'user': serializer.data
                },
                status=status.HTTP_200_OK
            )
    # ----------- RECENT ACCOUNTS ----------------
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser], url_path='recent-accounts')
    def recent_accounts(self, request):
        """
        Get recently added accounts.
        """
        limit = int(request.query_params.get('limit', 6))
        
        # Get recent users from UserProfile
        recent_users = UserProfile.objects.select_related('user').order_by('-created_at')[:limit]
        
        accounts = []
        for profile in recent_users:
            user = profile.user
            accounts.append({
                'id': user.id,
                'name': profile.full_name or user.get_full_name() or user.username,
                'email': user.email,
                'username': user.username,
                'phone': profile.phone_number or '',
                'accountType': profile.user_type,
                'registrationDate': profile.created_at.strftime('%Y-%m-%d %H:%M'),
                'avatar': (profile.full_name or user.username)[0] if profile.full_name or user.username else 'ع',
            })
        
        return Response(
            {
                'accounts': accounts,
                'count': len(accounts),
            },
            status=status.HTTP_200_OK
        )

    # ----------- REQUEST PASSWORD RESET ----------------
    @action(
        detail=False,
        methods=['post'],
        permission_classes=[AllowAny],
        throttle_classes=[AuthRateThrottle],
        url_path='request-password-reset'
    )
    def request_password_reset(self, request):
        """
        Request a password reset token via email.
        """
        serializer = RequestPasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            try:
                user = User.objects.get(email=email)
                
                # Delete previous reset tokens
                PasswordResetToken.objects.filter(user=user).delete()
                
                # Generate new token
                token = PasswordResetToken.generate_token()
                reset_token = PasswordResetToken.objects.create(
                    user=user,
                    token=token
                )
                
                # Log token generation (never print to stdout)
                logger.info(f"Password reset token generated for {user.email}")
                
                # Send email with token
                subject = "استعادة كلمة المرور - Eskan"
                message = f"""
                مرحبا {user.get_full_name() or user.username},
                
                لقد طلبت استعادة كلمة المرور. استخدم الرمز التالي لإعادة تعيين كلمتك:
                
                الرمز: {token}
                
                ينتهي الرمز بعد 3 دقائق.
                
                إذا لم تطلب هذا، يرجى تجاهل هذا البريد.
                
                ---
                Hello {user.get_full_name() or user.username},
                
                You requested to reset your password. Use the following code to reset your password:
                
                Code: {token}
                
                This code expires in 3 minutes.
                
                If you didn't request this, please ignore this email.
                """
                
                try:
                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email],
                        fail_silently=False,
                    )
                    # Never include token in response (even in development)
                    return Response(
                        {
                            'success': True,
                            'message': 'تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
                        },
                        status=status.HTTP_200_OK
                    )
                except Exception as e:
                    reset_token.delete()
                    return Response(
                        {
                            'success': False,
                            'error': 'حدث خطأ في إرسال البريد الإلكتروني'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            except User.DoesNotExist:
                # Don't reveal if email exists for security
                return Response(
                    {
                        'success': True,
                        'message': 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رمز إعادة تعيين'
                    },
                    status=status.HTTP_200_OK
                )
        
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------- RESET PASSWORD ----------------
    @action(
        detail=False,
        methods=['post'],
        permission_classes=[AllowAny],
        throttle_classes=[AuthRateThrottle],
        url_path='reset-password'
    )
    def reset_password(self, request):
        """
        Reset password using token.
        """
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            token = serializer.validated_data.get('token')
            new_password = serializer.validated_data.get('new_password')
            
            try:
                user = User.objects.get(email=email)
                
                # Get reset token
                try:
                    reset_token = PasswordResetToken.objects.get(user=user)
                except PasswordResetToken.DoesNotExist:
                    return Response(
                        {
                            'success': False,
                            'error': 'لا يوجد طلب استعادة كلمة مرور نشط. الرجاء طلب واحد جديد.'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Verify token matches exactly
                if reset_token.token != token:
                    reset_token.attempts += 1
                    reset_token.save()
                    return Response(
                        {
                            'success': False,
                            'error': 'الرمز غير صحيح'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Check if token is valid
                if not reset_token.is_valid():
                    reset_token.attempts += 1
                    reset_token.save()
                    
                    if reset_token.is_used:
                        return Response(
                            {
                                'success': False,
                                'error': 'تم استخدام هذا الرمز بالفعل'
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    else:
                        return Response(
                            {
                                'success': False,
                                'error': 'انتهت صلاحية الرمز'
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                # Reset password
                user.set_password(new_password)
                user.save()
                
                # Mark token as used
                reset_token.is_used = True
                reset_token.save()
                
                return Response(
                    {
                        'success': True,
                        'message': 'تم تغيير كلمة المرور بنجاح'
                    },
                    status=status.HTTP_200_OK
                )
                
            except User.DoesNotExist:
                return Response(
                    {
                        'success': False,
                        'error': 'لم يتم العثور على حساب'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            except PasswordResetToken.DoesNotExist:
                return Response(
                    {
                        'success': False,
                        'error': 'الرمز غير صحيح'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(
            {'success': False, 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )