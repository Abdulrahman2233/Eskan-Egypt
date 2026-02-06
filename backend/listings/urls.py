from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, AreaViewSet, OfferViewSet, ContactMessageViewSet

app_name = 'listings'

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'areas', AreaViewSet, basename='area')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('', include(router.urls)),
]
