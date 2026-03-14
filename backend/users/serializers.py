# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, PasswordResetToken
import re


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    """
    class Meta:
        model = UserProfile
        fields = [
            'user_type', 'full_name', 'email', 'phone_number',
            'date_of_birth', 'city',
            'is_email_verified', 'is_phone_verified',
            'created_at', 'updated_at', 'last_login_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'last_login_at']


class PublicUserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for public user profile - only shows safe public info.
    """
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    full_name = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)
    member_since = serializers.DateTimeField(source='created_at', read_only=True)
    properties_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'user_id', 'username', 'full_name', 'user_type',
            'city', 'member_since', 'properties_count', 'is_verified',
        ]

    def get_full_name(self, obj):
        # Prefer User.get_full_name() (first_name + last_name) as it's the source of truth
        return obj.user.get_full_name() or obj.full_name or obj.user.username

    def get_properties_count(self, obj):
        return obj.properties.filter(is_deleted=False, status='approved').count()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model with profile.
    """
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'profile', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'is_staff', 'is_superuser']

    def get_full_name(self, obj):
        # Consistent fallback: User first/last name → profile.full_name → username
        full = obj.get_full_name()
        if full:
            return full
        if hasattr(obj, 'profile') and obj.profile and obj.profile.full_name:
            return obj.profile.full_name
        return obj.username

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with validation.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )

    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    user_type = serializers.ChoiceField(
        choices=['tenant', 'landlord', 'agent', 'office', 'admin'],
        default='tenant',
        required=False
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'password', 'password_confirm', 'user_type']

    def validate_username(self, value):
        """Validate username format and uniqueness."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("اسم المستخدم موجود بالفعل")
        if not re.match(r'^[a-zA-Z0-9_.-]+$', value):
            raise serializers.ValidationError(
                "اسم المستخدم يجب أن يحتوي على حروف وأرقام وشرطات فقط"
            )
        return value

    def validate_email(self, value):
        """Validate email uniqueness."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("البريد الإلكتروني مسجل بالفعل")
        return value

    def validate(self, data):
        """Validate password fields match."""
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError(
                {"password": "كلمات المرور غير متطابقة"}
            )
        return data

    def create(self, validated_data):
        """Create user and profile."""
        validated_data.pop('password_confirm')  # Remove password_confirm
        user_type = validated_data.pop('user_type', 'tenant')
        phone_number = validated_data.pop('phone_number', '')
        password = validated_data.pop('password')

        # Create user using create_user (handles password hashing)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=password,
        )

        # Create full_name from first_name and last_name
        full_name = f"{validated_data.get('first_name', '')} {validated_data.get('last_name', '')}".strip()

        # Create profile with user_type, phone_number, email, and full_name
        UserProfile.objects.create(
            user=user,
            user_type=user_type,
            phone_number=phone_number,
            email=validated_data.get('email', ''),
            full_name=full_name
        )

        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        """Authenticate user."""
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError(
                    "اسم المستخدم أو كلمة المرور غير صحيحة"
                )
        else:
            raise serializers.ValidationError(
                "اسم المستخدم وكلمة المرور مطلوبان"
            )

        data['user'] = user
        return data

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing user password.
    """
    old_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True,
        min_length=8
    )
    new_password_confirm = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )

    def validate_new_password(self, value):
        """Validate new password format."""
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل"
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل"
            )
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(
                "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"
            )
        return value

    def validate(self, data):
        """Validate password confirmation."""
        if data.get('new_password') != data.get('new_password_confirm'):
            raise serializers.ValidationError(
                {"new_password": "كلمات المرور غير متطابقة"}
            )
        return data


class RequestPasswordResetSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset token.
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Validate email format (don't reveal if email exists for security)."""
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer for resetting password with token.
    """
    email = serializers.EmailField(required=True)
    token = serializers.CharField(required=True, max_length=6)
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True,
        min_length=8
    )
    new_password_confirm = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )

    def validate_new_password(self, value):
        """Validate new password format."""
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل"
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل"
            )
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(
                "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"
            )
        return value

    def validate(self, data):
        """Validate password confirmation and token."""
        if data.get('new_password') != data.get('new_password_confirm'):
            raise serializers.ValidationError(
                {"new_password": "كلمات المرور غير متطابقة"}
            )
        return data