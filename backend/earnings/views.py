from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count, Avg, Q
from datetime import datetime, timedelta
from .models import UserEarning
from .serializers import UserEarningSerializer, EarningsSummarySerializer


class IsOwner(permissions.BasePermission):
    """
    Custom permission للتأكد من أن المستخدم يملك الإيصال فقط
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class UserEarningViewSet(viewsets.ModelViewSet):
    """
    ViewSet لإدارة أرباح المستخدم
    
    يوفر:
    - CRUD operations للأرباح
    - تصفية حسب التاريخ والمنطقة ونوع العقار
    - ملخص الأرباح والإحصائيات
    """
    serializer_class = UserEarningSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['property_name', 'area', 'property_type']
    ordering_fields = ['deal_date', 'earnings', 'created_at']
    ordering = ['-deal_date']
    
    def get_queryset(self):
        """
        احصل على أرباح المستخدم الحالي فقط
        """
        return UserEarning.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        إنشاء سجل أرباح جديد للمستخدم الحالي
        """
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """
        تحديث سجل الأرباح
        """
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        الحصول على ملخص الأرباح والإحصائيات
        """
        queryset = self.get_queryset()
        
        # الأرباح الكلية
        total_earnings = queryset.aggregate(Sum('earnings'))['earnings__sum'] or 0
        
        # عدد الصفقات
        total_deals = queryset.count()
        
        # متوسط الصفقة
        average_deal = queryset.aggregate(Avg('earnings'))['earnings__avg'] or 0
        
        # الأرباح لهذا الشهر
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_earnings = queryset.filter(
            deal_date__gte=this_month_start.date()
        ).aggregate(Sum('earnings'))['earnings__sum'] or 0
        
        # الأرباح للشهر الماضي
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
        last_month_end = this_month_start - timedelta(days=1)
        last_month_earnings = queryset.filter(
            deal_date__gte=last_month_start.date(),
            deal_date__lte=last_month_end.date()
        ).aggregate(Sum('earnings'))['earnings__sum'] or 0
        
        # النسبة المئوية للنمو
        if last_month_earnings > 0:
            growth_percentage = ((this_month_earnings - last_month_earnings) / last_month_earnings) * 100
        else:
            growth_percentage = 100 if this_month_earnings > 0 else 0
        
        data = {
            'total_earnings': total_earnings,
            'this_month_earnings': this_month_earnings,
            'last_month_earnings': last_month_earnings,
            'average_deal': average_deal,
            'total_deals': total_deals,
            'growth_percentage': round(growth_percentage, 2)
        }
        
        serializer = EarningsSummarySerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        الحصول على الأرباح مجمعة حسب نوع العقار
        """
        queryset = self.get_queryset()
        result = queryset.values('property_type', 'get_property_type_display').annotate(
            total=Sum('earnings'),
            count=Count('id')
        ).order_by('-total')
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def by_area(self, request):
        """
        الحصول على الأرباح مجمعة حسب المنطقة
        """
        queryset = self.get_queryset()
        result = queryset.values('area').annotate(
            total=Sum('earnings'),
            count=Count('id')
        ).order_by('-total')
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def monthly(self, request):
        """
        الحصول على الأرباح الشهرية (آخر 12 شهر)
        """
        queryset = self.get_queryset()
        months_data = []
        
        for i in range(11, -1, -1):
            d = timezone.now() - timedelta(days=30*i)
            month_start = d.replace(day=1, hour=0, minute=0, second=0, microsecond=0).date()
            
            if i > 0:
                month_end = (d - timedelta(days=30*(i-1))).replace(
                    day=1, hour=23, minute=59, second=59, microsecond=999999
                ).date()
            else:
                month_end = timezone.now().date()
            
            month_earnings = queryset.filter(
                deal_date__gte=month_start,
                deal_date__lte=month_end
            ).aggregate(Sum('earnings'))['earnings__sum'] or 0
            
            months_data.append({
                'month': d.strftime('%Y-%m'),
                'month_ar': d.strftime('%b'),
                'earnings': month_earnings
            })
        
        return Response(months_data)
    
    @action(detail=False, methods=['get'])
    def filter_by_date(self, request):
        """
        تصفية الأرباح حسب نطاق التاريخ
        
        المعاملات:
        - from_date: التاريخ البداية (YYYY-MM-DD)
        - to_date: التاريخ النهاية (YYYY-MM-DD)
        """
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        
        queryset = self.get_queryset()
        
        if from_date:
            queryset = queryset.filter(deal_date__gte=from_date)
        if to_date:
            queryset = queryset.filter(deal_date__lte=to_date)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
