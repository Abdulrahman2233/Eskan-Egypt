"""
Analytics Views and Utilities for Dashboard
توفير بيانات تحليلية شاملة للوحة التحكم
"""

from django.db.models import Count, Q, Avg, Sum, Max, Min
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import Property, Area, Offer, ContactMessage, ActivityLog
from users.models import UserProfile


class DashboardAnalytics:
    """فئة لمعالجة تحليلات لوحة التحكم"""
    
    @staticmethod
    def get_property_stats():
        """الحصول على إحصائيات العقارات"""
        total_properties = Property.objects.filter(is_deleted=False).count()
        approved_properties = Property.objects.filter(status='approved', is_deleted=False).count()
        pending_properties = Property.objects.filter(status='pending', is_deleted=False).count()
        deleted_properties = Property.objects.filter(is_deleted=True).count()
        
        total_value = Property.objects.filter(is_deleted=False).aggregate(
            total=Sum('price')
        )['total'] or Decimal('0')
        
        # إحصائيات اليوم
        today = timezone.now().date()
        properties_today = Property.objects.filter(created_at__date=today, is_deleted=False).count()
        
        return {
            'total': total_properties,
            'approved': approved_properties,
            'pending': pending_properties,
            'draft': Property.objects.filter(status='draft', is_deleted=False).count(),
            'rejected': Property.objects.filter(status='rejected', is_deleted=False).count(),
            'deleted': deleted_properties,
            'total_value': float(total_value),
            'avg_price': float(
                Property.objects.filter(is_deleted=False).aggregate(avg=Avg('price'))['avg'] or Decimal('0')
            ),
            'today': properties_today,
        }
    
    @staticmethod
    def get_user_stats():
        """الحصول على إحصائيات المستخدمين"""
        total_users = UserProfile.objects.count()
        today = timezone.now().date()
        new_users_today = UserProfile.objects.filter(
            created_at__date=today
        ).count()
        
        user_types = UserProfile.objects.values('user_type').annotate(
            count=Count('id')
        )
        
        # حساب إجمالي الزيارات والزوار الفريدين من نموذج Visitor
        from .models import Visitor
        
        total_unique_visitors = Visitor.objects.count()
        total_visits = Visitor.objects.aggregate(
            total=Sum('visit_count')
        )['total'] or 0
        
        # حساب الزيارات اليوم
        visitors_today = Visitor.objects.filter(
            last_visited__date=today
        ).count()
        
        return {
            'total': total_users,
            'new_today': new_users_today,
            'by_type': {item['user_type']: item['count'] for item in user_types},
            'active_users': UserProfile.objects.filter(
                last_login_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
            'total_visits': total_visits,
            'total_unique_visitors': total_unique_visitors,
            'visitors_today': visitors_today,
        }
    
    @staticmethod
    def get_area_stats():
        """الحصول على إحصائيات المناطق"""
        areas = Area.objects.annotate(
            property_count=Count('properties', filter=Q(properties__is_deleted=False)),
            avg_price=Avg('properties__price', filter=Q(properties__is_deleted=False)),
            total_properties_value=Sum('properties__price', filter=Q(properties__is_deleted=False))
        ).order_by('-property_count')[:10]
        
        return [
            {
                'name': area.name,
                'property_count': area.property_count,
                'avg_price': float(area.avg_price or Decimal('0')),
                'total_value': float(area.total_properties_value or Decimal('0')),
            }
            for area in areas
        ]
    
    @staticmethod
    def get_property_by_type():
        """الحصول على توزيع العقارات حسب النوع"""
        usage_types = {
            'students': 'طلاب',
            'families': 'عائلات',
            'studio': 'استوديو',
            'vacation': 'مصيفين',
            'daily': 'حجز يومي',
        }
        
        stats = Property.objects.filter(is_deleted=False).values('usage_type').annotate(
            count=Count('id'),
            avg_price=Avg('price')
        )
        
        return [
            {
                'name': usage_types.get(item['usage_type'], item['usage_type']),
                'value': item['count'],
                'avg_price': float(item['avg_price'] or Decimal('0')),
            }
            for item in stats
        ]
    
    @staticmethod
    def get_rooms_distribution():
        """الحصول على توزيع العقارات حسب عدد الغرف"""
        properties = Property.objects.filter(status='approved', is_deleted=False)
        
        # حساب عدد العقارات لكل فئة غرف
        one_room = properties.filter(rooms=1).count()
        two_rooms = properties.filter(rooms=2).count()
        three_rooms = properties.filter(rooms=3).count()
        four_plus_rooms = properties.filter(rooms__gte=4).count()
        
        return [
            {'name': 'غرفة', 'value': one_room, 'color': '#0ea5e9'},
            {'name': 'غرفتين', 'value': two_rooms, 'color': '#14b8a6'},
            {'name': '3 غرف', 'value': three_rooms, 'color': '#22c55e'},
            {'name': '4+ غرف', 'value': four_plus_rooms, 'color': '#f59e0b'},
        ]
    
    @staticmethod
    def get_offers_stats():
        """الحصول على إحصائيات العروض"""
        active_offers = Offer.objects.filter(is_active=True).count()
        total_offers = Offer.objects.count()
        
        return {
            'active': active_offers,
            'total': total_offers,
            'avg_discount': float(
                Offer.objects.aggregate(avg=Avg('discount_percentage'))['avg'] or Decimal('0')
            ),
        }
    
    @staticmethod
    def get_recent_activities(limit=10):
        """الحصول على آخر الأنشطة"""
        activities = ActivityLog.objects.select_related('user').order_by(
            '-timestamp'
        )[:limit]
        
        return [
            {
                'id': activity.id,
                'user': str(activity.user) if activity.user else 'نظام',
                'action': activity.get_action_display(),
                'object_name': activity.object_name,
                'timestamp': activity.timestamp.isoformat(),
                'description': activity.description,
            }
            for activity in activities
        ]
    
    @staticmethod
    def get_top_properties(limit=5):
        """الحصول على أكثر العقارات مشاهدة (حسب الإرسالات/التحديثات)"""
        properties = Property.objects.filter(
            status='approved', is_deleted=False
        ).order_by('-updated_at')[:limit]
        
        return [
            {
                'id': str(prop.id),
                'name': prop.name,
                'area': prop.area.name if prop.area else 'غير محدد',
                'price': float(prop.price),
                'rooms': prop.rooms,
                'images_count': prop.images.count(),
                'featured': prop.featured,
            }
            for prop in properties
        ]
    
    @staticmethod
    def get_contact_messages_stats():
        """الحصول على إحصائيات رسائل التواصل"""
        total_messages = ContactMessage.objects.count()
        messages_today = ContactMessage.objects.filter(
            created_at__date=timezone.now().date()
        ).count()
        
        return {
            'total': total_messages,
            'today': messages_today,
            'avg_per_day': round(
                total_messages / max(ContactMessage.objects.aggregate(
                    days=Count('created_at', distinct=True)
                )['days'] or 1, 1),
                2
            ),
        }
    
    @staticmethod
    def get_price_distribution():
        """الحصول على توزيع الأسعار"""
        price_ranges = [
            {'min': 0, 'max': 10000, 'label': 'أقل من 10,000'},
            {'min': 10000, 'max': 50000, 'label': '10,000 - 50,000'},
            {'min': 50000, 'max': 100000, 'label': '50,000 - 100,000'},
            {'min': 100000, 'max': 500000, 'label': '100,000 - 500,000'},
            {'min': 500000, 'max': None, 'label': 'أكثر من 500,000'},
        ]
        
        result = []
        for range_item in price_ranges:
            query = Q(price__gte=range_item['min'])
            if range_item['max']:
                query &= Q(price__lt=range_item['max'])
            
            count = Property.objects.filter(query, status='approved', is_deleted=False).count()
            result.append({
                'label': range_item['label'],
                'value': count,
            })
        
        return result
    
    @staticmethod
    def get_daily_activity(days=30):
        """الحصول على نشاط يومي للـ X أيام الماضية"""
        start_date = timezone.now() - timedelta(days=days)
        
        activities = ActivityLog.objects.filter(
            timestamp__gte=start_date
        ).values('timestamp__date').annotate(
            count=Count('id')
        ).order_by('timestamp__date')
        
        return [
            {
                'date': str(activity['timestamp__date']),
                'count': activity['count'],
            }
            for activity in activities
        ]
    
    @staticmethod
    def get_device_stats():
        """الحصول على إحصائيات الأجهزة المستخدمة"""
        from .models import Visitor
        
        device_stats = Visitor.objects.values('device_type').annotate(
            count=Count('id'),
            total_visits=Sum('visit_count')
        ).order_by('-count')
        
        result = {}
        for stat in device_stats:
            device_type = stat['device_type']
            device_display = dict(Visitor.DEVICE_TYPE_CHOICES).get(device_type, device_type)
            result[device_type] = {
                'label': device_display,
                'count': stat['count'],
                'total_visits': stat['total_visits'] or 0,
                'percentage': 0
            }
        
        # حساب النسب المئوية بناءً على إجمالي الزيارات (بيانات حقيقية)
        total_visits = sum(device['total_visits'] for device in result.values())
        if total_visits > 0:
            for device in result.values():
                device['percentage'] = round((device['total_visits'] / total_visits) * 100, 2)
        
        return result
    
    @staticmethod
    def get_top_owners(limit=4, user_type='landlord'):
        """الحصول على أفضل المالكين/الوسطاء/المكاتب"""
        users = UserProfile.objects.filter(
            user_type=user_type
        ).annotate(
            property_count=Count('properties', distinct=True, filter=Q(properties__is_deleted=False))
        ).order_by('-property_count')[:limit]
        
        return [
            {
                'id': str(user.id),
                'name': user.full_name or user.user.get_full_name() or user.user.username,
                'properties': user.property_count,
                'avatar': (user.full_name or user.user.get_full_name() or user.user.username)[0].upper(),
                'user_type': user.user_type,
            }
            for user in users
        ]
    
    @staticmethod
    def get_dashboard_summary():
        """الحصول على ملخص شامل للوحة التحكم"""
        return {
            'properties': DashboardAnalytics.get_property_stats(),
            'users': DashboardAnalytics.get_user_stats(),
            'areas': DashboardAnalytics.get_area_stats(),
            'property_types': DashboardAnalytics.get_property_by_type(),
            'rooms_distribution': DashboardAnalytics.get_rooms_distribution(),
            'offers': DashboardAnalytics.get_offers_stats(),
            'contact_messages': DashboardAnalytics.get_contact_messages_stats(),
            'price_distribution': DashboardAnalytics.get_price_distribution(),
            'recent_activities': DashboardAnalytics.get_recent_activities(limit=15),
            'top_properties': DashboardAnalytics.get_top_properties(limit=10),
            'daily_activity': DashboardAnalytics.get_daily_activity(days=30),
        }
