from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
)
from .models import UserProfile

class AuthViewSet(viewsets.ViewSet):
    """
    Authentication ViewSet for Register/Login/Logout/Profile/ChangePassword.
    """
    permission_classes = [IsAuthenticated]

    # ----------- REGISTER ----------------
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
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
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            token, _ = Token.objects.get_or_create(user=user)
            profile = user.profile
            profile.update_last_login()
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
