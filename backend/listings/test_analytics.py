"""
اختبارات سريعة لنظام التحليلات
"""

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.utils import timezone
from listings.models import Property, Area, Offer, ContactMessage, ActivityLog
from users.models import UserProfile
from listings.analytics import DashboardAnalytics
from decimal import Decimal


class AnalyticsTestCase(TestCase):
    """اختبارات نظام التحليلات"""
    
    def setUp(self):
        """إعداد البيانات للاختبار"""
        # إنشاء مستخدم إداري
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='testpass123'
        )
        self.admin_profile = UserProfile.objects.create(
            user=self.admin_user,
            user_type='admin'
        )
        
        # إنشاء منطقة
        self.area = Area.objects.create(name='المنطقة التجريبية')
        
        # إنشاء عقارات
        for i in range(5):
            property_obj = Property.objects.create(
                name=f'عقار تجريبي {i+1}',
                area=self.area,
                address=f'عنوان تجريبي {i+1}',
                price=Decimal('50000') + (i * Decimal('10000')),
                rooms=2 + i,
                beds=1 + i,
                bathrooms=1,
                size=100 + (i * 10),
                floor=1,
                description='وصف تجريبي',
                contact='0501234567',
                usage_type='families',
                status='approved',
                owner=self.admin_profile
            )
        
        # إنشاء عرض
        self.offer = Offer.objects.create(
            title='عرض تجريبي',
            description='وصف العرض',
            discount_percentage=20,
            target_audience='all',
            start_date=timezone.now(),
            is_active=True
        )
        
        # إنشاء رسالة تواصل
        self.contact = ContactMessage.objects.create(
            name='اسم تجريبي',
            email='test@example.com',
            subject='موضوع تجريبي',
            message='رسالة تجريبية'
        )
        
        # إنشاء سجل نشاط
        self.activity = ActivityLog.objects.create(
            user=self.admin_profile,
            action='create_property',
            content_type='property',
            object_id='1',
            object_name='عقار تجريبي',
            description='تم إنشاء عقار جديد'
        )
    
    def test_property_stats(self):
        """اختبار إحصائيات العقارات"""
        stats = DashboardAnalytics.get_property_stats()
        
        self.assertEqual(stats['total'], 5)
        self.assertEqual(stats['approved'], 5)
        self.assertGreater(stats['total_value'], 0)
        self.assertGreater(stats['avg_price'], 0)
        print("✅ اختبار إحصائيات العقارات - نجح")
    
    def test_user_stats(self):
        """اختبار إحصائيات المستخدمين"""
        stats = DashboardAnalytics.get_user_stats()
        
        self.assertGreaterEqual(stats['total'], 1)
        self.assertIn('admin', stats['by_type'])
        print("✅ اختبار إحصائيات المستخدمين - نجح")
    
    def test_area_stats(self):
        """اختبار إحصائيات المناطق"""
        stats = DashboardAnalytics.get_area_stats()
        
        self.assertGreater(len(stats), 0)
        self.assertEqual(stats[0]['name'], 'المنطقة التجريبية')
        self.assertEqual(stats[0]['property_count'], 5)
        print("✅ اختبار إحصائيات المناطق - نجح")
    
    def test_property_by_type(self):
        """اختبار توزيع أنواع العقارات"""
        stats = DashboardAnalytics.get_property_by_type()
        
        self.assertGreater(len(stats), 0)
        families_stat = next((s for s in stats if s['name'] == 'عائلات'), None)
        self.assertIsNotNone(families_stat)
        print("✅ اختبار توزيع أنواع العقارات - نجح")
    
    def test_offers_stats(self):
        """اختبار إحصائيات العروض"""
        stats = DashboardAnalytics.get_offers_stats()
        
        self.assertEqual(stats['active'], 1)
        self.assertEqual(stats['total'], 1)
        self.assertEqual(stats['avg_discount'], 20)
        print("✅ اختبار إحصائيات العروض - نجح")
    
    def test_recent_activities(self):
        """اختبار آخر الأنشطة"""
        activities = DashboardAnalytics.get_recent_activities(limit=10)
        
        self.assertGreater(len(activities), 0)
        self.assertIn('user', activities[0])
        self.assertIn('action', activities[0])
        print("✅ اختبار آخر الأنشطة - نجح")
    
    def test_contact_messages_stats(self):
        """اختبار إحصائيات رسائل التواصل"""
        stats = DashboardAnalytics.get_contact_messages_stats()
        
        self.assertEqual(stats['total'], 1)
        self.assertGreaterEqual(stats['today'], 0)
        print("✅ اختبار إحصائيات رسائل التواصل - نجح")
    
    def test_dashboard_summary(self):
        """اختبار الملخص الشامل"""
        summary = DashboardAnalytics.get_dashboard_summary()
        
        self.assertIn('properties', summary)
        self.assertIn('users', summary)
        self.assertIn('areas', summary)
        self.assertIn('property_types', summary)
        self.assertIn('offers', summary)
        self.assertIn('recent_activities', summary)
        print("✅ اختبار الملخص الشامل - نجح")
    
    def test_api_summary_endpoint(self):
        """اختبار API endpoint للملخص"""
        client = Client()
        client.force_login(self.admin_user)
        
        response = client.get('/api/listings/analytics/summary/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('properties', data)
        print("✅ اختبار API endpoint - نجح")
    
    def test_api_properties_endpoint(self):
        """اختبار API endpoint للعقارات"""
        client = Client()
        client.force_login(self.admin_user)
        
        response = client.get('/api/listings/analytics/properties/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['total'], 5)
        print("✅ اختبار API properties endpoint - نجح")
    
    def test_admin_permission_required(self):
        """اختبار أن صلاحيات الإدمن مطلوبة"""
        # إنشاء مستخدم عادي
        regular_user = User.objects.create_user(
            username='regular',
            email='regular@test.com',
            password='testpass123'
        )
        UserProfile.objects.create(
            user=regular_user,
            user_type='tenant'
        )
        
        client = Client()
        client.force_login(regular_user)
        
        response = client.get('/api/listings/analytics/summary/')
        
        # يجب أن يكون 403 (Forbidden)
        self.assertEqual(response.status_code, 403)
        print("✅ اختبار أن صلاحيات الإدمن مطلوبة - نجح")


if __name__ == '__main__':
    import unittest
    unittest.main()
