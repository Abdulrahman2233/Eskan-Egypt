"""
Signals for user-related events
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models import Q
from .models import UserProfile

# Note: The notifications for new users are handled in listings/signals.py
# This file is kept for future user-related signals if needed
