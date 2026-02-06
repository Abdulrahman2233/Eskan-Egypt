from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, AreaViewSet

app_name = 'listings'

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'areas', AreaViewSet, basename='area')

urlpatterns = [
    path('', include(router.urls)),
]
