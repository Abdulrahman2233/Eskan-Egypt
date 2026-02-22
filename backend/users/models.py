# users/models.py
from django.contrib.auth.models import User
from django.db import models
from django.core.validators import URLValidator
from django.utils import timezone
import secrets

class UserProfile(models.Model):
    """
    Extended user profile with additional authentication fields.
    """
    USER_TYPE_CHOICES = [
        ('landlord', 'Landlord'),
        ('agent', 'Agent'),
        ('office', 'Office'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )

    # Profile Information
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='landlord'
    )
    full_name = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )
    email = models.EmailField(
        blank=True,
        null=True
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # Account Status
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.get_user_type_display()})"

    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login_at = timezone.now()
        self.save(update_fields=['last_login_at'])


class PasswordResetToken(models.Model):
    """
    Model to store password reset tokens.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_token'
    )
    token = models.CharField(
        max_length=6,
        unique=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Reset token for {self.user.username}"

    @staticmethod
    def generate_token():
        """Generate a 6-digit reset token."""
        return str(secrets.randbelow(1000000)).zfill(6)

    def is_valid(self):
        """Check if token is still valid (not expired and not used)."""
        # Token expires after 3 minutes
        from datetime import timedelta
        return (
            not self.is_used and 
            timezone.now() - self.created_at < timedelta(minutes=3) and
            self.attempts < 5
        )