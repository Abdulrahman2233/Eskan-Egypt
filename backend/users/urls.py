# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AuthViewSet

app_name = "users"

router = DefaultRouter()
router.include_format_suffixes = False  # مناسب مع Django 5.1+
router.register(r"auth", AuthViewSet, basename="auth")

urlpatterns = [
    path("", include(router.urls)),
]
