from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyViewSet, AreaViewSet, OfferViewSet, ContactMessageViewSet,
    ActivityLogViewSet, DashboardAnalyticsViewSet, TransactionViewSet, VisitorViewSet, NotificationViewSet
)

app_name = 'listings'

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'areas', AreaViewSet, basename='area')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-log')
router.register(r'analytics', DashboardAnalyticsViewSet, basename='analytics')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'visitors', VisitorViewSet, basename='visitor')
router.register(r'notifications', NotificationViewSet, basename='notification')
urlpatterns = [
    path('', include(router.urls)),
]