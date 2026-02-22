"""
Listings App Views Package
جميع الـ ViewSets للقوائم والعقارات
"""

from .utils import get_client_ip

# Property Management
from .properties import PropertyViewSet

# Basic ViewSets
from .basic import (
    AreaViewSet,
    AmenityViewSet,
    OfferViewSet,
    ContactMessageViewSet,
)

# Analytics and Tracking
from .analytics import (
    ActivityLogViewSet,
    DashboardAnalyticsViewSet,
    TransactionViewSet,
    VisitorViewSet,
)

# Notifications
from .notifications import NotificationViewSet

__all__ = [
    # Utils
    'get_client_ip',
    # Property Management
    'PropertyViewSet',
    # Basic
    'AreaViewSet',
    'AmenityViewSet',
    'OfferViewSet',
    'ContactMessageViewSet',
    # Analytics
    'ActivityLogViewSet',
    'DashboardAnalyticsViewSet',
    'TransactionViewSet',
    'VisitorViewSet',
    # Notifications
    'NotificationViewSet',
]
