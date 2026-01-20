# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile
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
        return obj.get_full_name() or obj.username

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
            raise serializers.ValidationError("Username already exists.")
        if not re.match(r'^[a-zA-Z0-9_.-]+$', value):
            raise serializers.ValidationError(
                "Username must contain only letters, numbers, and underscores."
            )
        return value

    def validate_email(self, value):
        """Validate email uniqueness."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate(self, data):
        """Validate password fields match."""
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        """Create user and profile."""
        validated_data.pop('password_confirm')  # Remove password_confirm
        user_type = validated_data.pop('user_type', 'tenant')
        phone_number = validated_data.pop('phone_number', '')
        password = validated_data.pop('password')

        # Create user using create_user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )

        # Set password properly (this hashes it)
        user.set_password(password)
        user.save()

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
                    "Invalid username or password."
                )
        else:
            raise serializers.ValidationError(
                "Username and password are required."
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
                "Password must contain at least one uppercase letter."
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(
                "Password must contain at least one digit."
            )
        return value

    def validate(self, data):
        """Validate password confirmation."""
        if data.get('new_password') != data.get('new_password_confirm'):
            raise serializers.ValidationError(
                {"new_password": "Passwords do not match."}
            )
        return data