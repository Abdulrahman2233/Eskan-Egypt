"""
Analytics, Transactions, Visitors ViewSets
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.utils import timezone
from datetime import timedelta
from django.db import models

from ..models import ActivityLog, Transaction, Visitor
from ..serializers import ActivityLogSerializer, TransactionSerializer, VisitorSerializer, DashboardSummarySerializer
from ..analytics import DashboardAnalytics
from .utils import get_client_ip


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet لعرض وتحليل سجلات نشاط المستخدمين
    
    المميزات:
    - تتبع جميع عمليات المستخدمين (إضافة، تعديل، حذف، موافقة)
    - البحث حسب الفعل أو المستخدم
    - الفلترة حسب التاريخ
    - ترتيب حسب الوقت أو نوع الفعل
    
    الأذونات: IsAdminUser (الأدمن فقط)
    البيانات المسجلة: نوع الفعل، المستخدم، الوقت، عنوان IP
    """
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['action', 'object_name', 'user__user__username']
    ordering_fields = ['timestamp', 'action']
    ordering = ['-timestamp']
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        """فلترة السجلات"""
        queryset = self.queryset.select_related('user', 'user__user')
        
        action_filter = self.request.query_params.get('action')
        if action_filter:
            queryset = queryset.filter(action=action_filter)
        
        user_filter = self.request.query_params.get('user')
        if user_filter:
            queryset = queryset.filter(user__user__username=user_filter)
        
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(timestamp__gte=date_from)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(timestamp__lte=date_to)
        
        return queryset


class DashboardAnalyticsViewSet(viewsets.ViewSet):
    """
    ViewSet شامل لإحصائيات لوحة التحكم
    
    Endpoints المتاحة:
    - /analytics/summary/ - ملخص شامل (عدد العقارات، المستخدمين، الرسائل)
    - /analytics/properties/ - إحصائيات العقارات
    - /analytics/users/ - إحصائيات المستخدمين
    - /analytics/property_types/ - توزيع أنواع العقارات
    - /analytics/areas/ - إحصائيات المناطق
    - /analytics/offers/ - إحصائيات العروض
    - /analytics/recent_activities/ - آخر الأنشطة
    - /analytics/top_properties/?limit=5 - أكثر العقارات مشاهدة
    - /analytics/price_distribution/ - توزيع الأسعار
    - /analytics/daily_activity/?days=30 - النشاط اليومي
    - /analytics/contact_messages/ - إحصائيات الرسائل
    - /analytics/top_owners/ - أفضل المالكين
    - /analytics/device_stats/ - إحصائيات أنواع الأجهزة
    
    الأذونات: IsAdminUser (الأدمن فقط)
    """
    permission_classes = [IsAdminUser]
    
    def list(self, request):
        """قائمة الـ endpoints"""
        return Response({'message': 'استخدم /summary/ أو endpoints أخرى'})
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """ملخص شامل"""
        try:
            data = DashboardAnalytics.get_dashboard_summary()
            serializer = DashboardSummarySerializer(data)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def properties(self, request):
        """إحصائيات العقارات"""
        try:
            data = DashboardAnalytics.get_property_stats()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def users(self, request):
        """إحصائيات المستخدمين"""
        try:
            data = DashboardAnalytics.get_user_stats()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def property_types(self, request):
        """توزيع العقارات"""
        try:
            data = DashboardAnalytics.get_property_by_type()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def areas(self, request):
        """إحصائيات المناطق"""
        try:
            data = DashboardAnalytics.get_area_stats()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def offers(self, request):
        """إحصائيات العروض"""
        try:
            data = DashboardAnalytics.get_offers_stats()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def recent_activities(self, request):
        """آخر الأنشطة"""
        try:
            limit = request.query_params.get('limit', 10)
            data = DashboardAnalytics.get_recent_activities(limit=int(limit))
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def top_properties(self, request):
        """أكثر العقارات مشاهدة"""
        try:
            limit = request.query_params.get('limit', 5)
            data = DashboardAnalytics.get_top_properties(limit=int(limit))
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def price_distribution(self, request):
        """توزيع الأسعار"""
        try:
            data = DashboardAnalytics.get_price_distribution()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def daily_activity(self, request):
        """النشاط اليومي"""
        try:
            days = request.query_params.get('days', 30)
            data = DashboardAnalytics.get_daily_activity(days=int(days))
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def contact_messages(self, request):
        """إحصائيات الرسائل"""
        try:
            data = DashboardAnalytics.get_contact_messages_stats()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def top_owners(self, request):
        """أفضل المالكين"""
        try:
            user_type = request.query_params.get('user_type', 'landlord')
            limit = request.query_params.get('limit', 4)
            data = DashboardAnalytics.get_top_owners(limit=int(limit), user_type=user_type)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def device_stats(self, request):
        """إحصائيات الأجهزة"""
        try:
            data = DashboardAnalytics.get_device_stats()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet لإدارة الصفقات والأرباح
    
    العمليات المدعومة:
    - عرض الصفقات (القسم / الأدمن يرى الكل)
    - إضافة صفقة جديدة
    - تعديل الصفقات
    - حذف الصفقات
    
    الفلترة والبحث: حسب اسم العقار، المنطقة
    الترتيب: حسب الربح أو التاريخ
    
    الأذونات: IsAuthenticated (للمستخدمين المسجلين)
    البيانات المسجلة: اسم العقار، المنطقة، الإيجار، الربح، التاريخ
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['property_name', 'region']
    ordering_fields = ['profit', 'created_at', 'rent_price']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """جلب الصفقات"""
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Transaction.objects.all()
        else:
            try:
                user_profile = self.request.user.profile
                return Transaction.objects.filter(user=user_profile)
            except:
                from users.models import UserProfile
                user_profile, _ = UserProfile.objects.get_or_create(
                    user=self.request.user,
                    defaults={'user_type': 'landlord'}
                )
                return Transaction.objects.filter(user=user_profile)
    
    def perform_create(self, serializer):
        """حفظ الصفقة"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            user_profile = self.request.user.profile
        except:
            from users.models import UserProfile
            user_profile, created = UserProfile.objects.get_or_create(
                user=self.request.user,
                defaults={'user_type': 'landlord'}
            )
        
        transaction = serializer.save(user=user_profile)
        logger.info(f"Transaction saved with ID: {transaction.id}")
    
    @action(detail=False, methods=['get'])
    def my_transactions(self, request):
        """صفقات المستخدم"""
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        if not user_profile:
            return Response({'error': 'لم نتمكن من العثور على ملف المستخدم'}, status=status.HTTP_400_BAD_REQUEST)
        
        transactions = Transaction.objects.filter(user=user_profile).order_by('-created_at')
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """إحصائيات الصفقات"""
        queryset = self.get_queryset()
        
        try:
            from django.db.models import Sum, Avg, Count, Max
            
            stats = queryset.aggregate(
                total_transactions=Count('id'),
                total_profit=Sum('profit'),
                average_profit=Avg('profit'),
                highest_profit=Max('profit'),
                total_commission=Sum('commission'),
                total_rent_price=Sum('rent_price'),
            )
            
            return Response(stats)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def by_property_type(self, request):
        """إحصائيات حسب نوع العقار"""
        queryset = self.get_queryset()
        
        try:
            from django.db.models import Sum, Count
            
            stats = queryset.values('property_type').annotate(
                count=Count('id'),
                total_profit=Sum('profit'),
                average_profit=Sum('profit') / Count('id'),
            ).order_by('-total_profit')
            
            return Response(stats)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """إحصائيات حسب المنطقة"""
        queryset = self.get_queryset()
        
        try:
            from django.db.models import Sum, Count
            
            stats = queryset.values('region').annotate(
                count=Count('id'),
                total_profit=Sum('profit'),
                average_profit=Sum('profit') / Count('id'),
            ).order_by('-total_profit')
            
            return Response(stats)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def by_account_type(self, request):
        """إحصائيات حسب نوع الحساب"""
        queryset = self.get_queryset()
        
        try:
            from django.db.models import Sum, Count
            
            stats = queryset.values('account_type').annotate(
                count=Count('id'),
                total_profit=Sum('profit'),
                average_profit=Sum('profit') / Count('id'),
            ).order_by('-total_profit')
            
            return Response(stats)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VisitorViewSet(viewsets.ViewSet):
    """
    ViewSet لتتبع الزوار والإحصائيات
    
    Endpoints المتاحة:
    - POST /visitors/record_visit/ - تسجيل زيارة (تلقائي بدون مصادقة)
    - GET /visitors/today_count/ - عدد الزوار اليوم
    - GET /visitors/total_count/ - إجمالي الزوار
    - GET /visitors/ - قائمة الزوار (الأدمن فقط)
    
    البيانات المتتبعة:
    - عنوان IP
    - نوع المتصفح (User Agent)
    - نوع الجهاز (هاتف، تابلت، كمبيوتر)
    - عدد الزيارات لكل IP
    
    الأذونات: AllowAny للعمليات العامة، IsAdminUser للعرض الكامل
    """
    permission_classes = [AllowAny]
    
    def list(self, request):
        """قائمة الزوار"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'لا توجد صلاحية'},
                status=status.HTTP_403_FORBIDDEN
            )
        visitors = Visitor.objects.all().order_by('-last_visited')
        serializer = VisitorSerializer(visitors, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def record_visit(self, request):
        """تسجيل زائر"""
        try:
            ip_address = get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            visitor = Visitor.record_visitor(ip_address, user_agent)
            serializer = VisitorSerializer(visitor)
            
            return Response({
                'message': 'تم تسجيل الزائر بنجاح',
                'visitor': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def today_count(self, request):
        """عدد الزوار اليوم"""
        today = timezone.now().date()
        count = Visitor.objects.filter(first_visited__date=today).count()
        return Response({'visitors_today': count})
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def total_count(self, request):
        """إجمالي الزوار"""
        count = Visitor.objects.count()
        total_visits = Visitor.objects.aggregate(total=models.Sum('visit_count'))['total'] or 0
        return Response({
            'total_unique_visitors': count,
            'total_visits': total_visits
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def daily_stats(self, request):
        """إحصائيات الزوار اليومية (زوار فريدين لكل يوم)"""
        try:
            days = int(request.query_params.get('days', 30))
            if days < 1:
                days = 1

            today = timezone.now().date()
            start_date = today - timedelta(days=days - 1)

            queryset = (
                Visitor.objects.filter(first_visited__date__gte=start_date)
                .values('first_visited__date')
                .annotate(visitors=models.Count('id'))
            )

            counts_by_date = {
                str(item['first_visited__date']): item['visitors'] for item in queryset
            }

            data = []
            for i in range(days):
                current_date = start_date + timedelta(days=i)
                key = str(current_date)
                data.append({
                    'date': key,
                    'visitors': counts_by_date.get(key, 0)
                })

            return Response({'results': data})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
