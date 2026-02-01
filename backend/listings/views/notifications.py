"""
Notifications ViewSet
إدارة الإشعارات للمستخدمين
"""

from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.db.models import Q

from ..models import Notification
from ..serializers import NotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet للإشعارات
    
    Endpoints:
    - GET /api/notifications/ - الحصول على جميع إشعارات المستخدم
    - GET /api/notifications/{id}/ - الحصول على إشعار محدد
    - PUT /api/notifications/{id}/ - تحديث الإشعار
    - PATCH /api/notifications/{id}/ - تحديث جزئي
    - DELETE /api/notifications/{id}/ - حذف الإشعار
    - POST /api/notifications/{id}/mark-as-read/ - تحديد كمقروء
    - POST /api/notifications/mark-all-as-read/ - تحديد جميعها كمقروءة
    - GET /api/notifications/unread-count/ - عدد الإشعارات غير المقروءة
    """
    
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """الحصول على الإشعارات الخاصة بالمستخدم الحالي فقط"""
        user_profile = self.request.user.profile
        queryset = Notification.objects.filter(recipient=user_profile)
        
        # تصفية حسب النوع إذا تم تمرير معامل
        notification_type = self.request.query_params.get('type', None)
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # تصفية حسب حالة القراءة
        is_read = self.request.query_params.get('is_read', None)
        if is_read is not None:
            is_read = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def mark_as_read(self, request, pk=None):
        """
        تحديد إشعار واحد كمقروء
        POST /api/notifications/{id}/mark-as-read/
        """
        notification = self.get_object()
        
        # التحقق من أن المستخدم هو مستقبل الإشعار
        if notification.recipient != request.user.profile:
            return Response(
                {'detail': 'لا يمكنك تحديد هذا الإشعار'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.mark_as_read()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def mark_all_as_read(self, request):
        """
        تحديد جميع الإشعارات غير المقروءة كمقروءة
        POST /api/notifications/mark-all-as-read/
        """
        user_profile = request.user.profile
        unread_notifications = Notification.objects.filter(
            recipient=user_profile,
            is_read=False
        )
        
        count = 0
        for notification in unread_notifications:
            notification.mark_as_read()
            count += 1
        
        return Response({
            'detail': f'تم تحديد {count} إشعار كمقروء',
            'count': count
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def unread_count(self, request):
        """
        الحصول على عدد الإشعارات غير المقروءة
        GET /api/notifications/unread-count/
        """
        user_profile = request.user.profile
        unread_count = Notification.objects.filter(
            recipient=user_profile,
            is_read=False
        ).count()
        
        return Response({
            'unread_count': unread_count
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def recent(self, request):
        """
        الحصول على آخر 10 إشعارات
        GET /api/notifications/recent/
        """
        user_profile = request.user.profile
        notifications = Notification.objects.filter(
            recipient=user_profile
        )[:10]
        
        serializer = self.get_serializer(notifications, many=True)
        return Response({
            'count': len(notifications),
            'results': serializer.data
        })
    
    @action(detail=False, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def clear_all(self, request):
        """
        حذف جميع الإشعارات
        DELETE /api/notifications/clear-all/
        """
        user_profile = request.user.profile
        count, _ = Notification.objects.filter(
            recipient=user_profile
        ).delete()
        
        return Response({
            'detail': f'تم حذف {count} إشعار',
            'deleted_count': count
        })
    
    def destroy(self, request, *args, **kwargs):
        """حذف إشعار واحد"""
        notification = self.get_object()
        
        # التحقق من أن المستخدم هو مستقبل الإشعار
        if notification.recipient != request.user.profile:
            return Response(
                {'detail': 'لا يمكنك حذف هذا الإشعار'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)
