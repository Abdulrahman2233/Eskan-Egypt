# users/apps.py
from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"
    
    def ready(self):
        """Import signals when the app is ready"""
        # Import signals if they exist
        try:
            import users.signals
        except ImportError:
            pass
