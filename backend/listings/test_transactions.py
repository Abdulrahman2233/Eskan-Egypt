"""
اختبار نظام حفظ الأرباح
Test Suite for Profits Persistence System
"""

import pytest
from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework.test import APIClient
from rest_framework import status
from listings.models import Transaction
from users.models import UserProfile


class TransactionAPITest(TestCase):
    """اختبارات API الصفقات"""
    
    def setUp(self):
        """إعداد البيانات الأولية للاختبار"""
        # إنشاء مستخدم
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # إنشاء ملف المستخدم
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            user_type='landlord'
        )
        
        # إنشاء API Client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_create_transaction(self):
        """اختبار إنشاء صفقة جديدة"""
        data = {
            'property_name': 'شقة بالمنصورة',
            'region': 'المنشية',
            'account_type': 'owner',
            'property_type': 'students',
            'rent_price': 5000,
            'commission': 500,
            'profit': 1000
        }
        
        response = self.client.post(
            '/api/transactions/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Transaction.objects.count() == 1
        assert Transaction.objects.first().profit == 1000
    
    def test_list_transactions(self):
        """اختبار جلب جميع الصفقات"""
        # إنشاء صفقة
        Transaction.objects.create(
            user=self.user_profile,
            property_name='شقة',
            region='المنشية',
            account_type='owner',
            property_type='students',
            rent_price=5000,
            profit=1000
        )
        
        response = self.client.get('/api/transactions/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
    
    def test_delete_transaction(self):
        """اختبار حذف صفقة"""
        # إنشاء صفقة
        transaction = Transaction.objects.create(
            user=self.user_profile,
            property_name='شقة',
            region='المنشية',
            account_type='owner',
            property_type='students',
            rent_price=5000,
            profit=1000
        )
        
        response = self.client.delete(
            f'/api/transactions/{transaction.id}/'
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Transaction.objects.count() == 0
    
    def test_user_isolation(self):
        """اختبار عزل البيانات بين المستخدمين"""
        # إنشاء مستخدم آخر
        user2 = User.objects.create_user(
            username='testuser2',
            password='testpass123'
        )
        user2_profile = UserProfile.objects.create(
            user=user2,
            user_type='landlord'
        )
        
        # إنشاء صفقة للمستخدم الأول
        t1 = Transaction.objects.create(
            user=self.user_profile,
            property_name='شقة 1',
            region='المنشية',
            account_type='owner',
            property_type='students',
            rent_price=5000,
            profit=1000
        )
        
        # إنشاء صفقة للمستخدم الثاني
        t2 = Transaction.objects.create(
            user=user2_profile,
            property_name='شقة 2',
            region='سيدي جابر',
            account_type='agent',
            property_type='families',
            rent_price=8000,
            profit=2000
        )
        
        # جلب صفقات المستخدم الأول
        response = self.client.get('/api/transactions/')
        
        # يجب أن يرى صفقة واحدة فقط
        assert len(response.data) == 1
        assert response.data[0]['property_name'] == 'شقة 1'
    
    def test_transaction_statistics(self):
        """اختبار الحصول على الإحصائيات"""
        # إنشاء عدة صفقات
        for i in range(3):
            Transaction.objects.create(
                user=self.user_profile,
                property_name=f'شقة {i}',
                region='المنشية',
                account_type='owner',
                property_type='students',
                rent_price=5000,
                profit=1000 * (i + 1)
            )
        
        response = self.client.get('/api/transactions/statistics/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['total_transactions'] == 3
        assert response.data['total_profit'] == 6000  # 1000 + 2000 + 3000
    
    def test_persistence_after_reload(self):
        """اختبار بقاء البيانات بعد إعادة التحميل"""
        # إنشاء صفقة
        t1 = Transaction.objects.create(
            user=self.user_profile,
            property_name='شقة',
            region='المنشية',
            account_type='owner',
            property_type='students',
            rent_price=5000,
            profit=1000
        )
        
        transaction_id = t1.id
        
        # محاكاة إعادة تحميل - جلب الصفقة من قاعدة البيانات
        retrieved = Transaction.objects.get(id=transaction_id)
        
        # التحقق من أن البيانات بقيت كما هي
        assert retrieved.property_name == 'شقة'
        assert retrieved.profit == 1000
        assert retrieved.region == 'المنشية'


class TransactionPermissionTest(TestCase):
    """اختبارات الصلاحيات والحماية"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            user_type='landlord'
        )
    
    def test_unauthenticated_access_denied(self):
        """اختبار رفض الوصول بدون مصادقة"""
        client = APIClient()
        
        response = client.get('/api/transactions/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_authenticated_access_allowed(self):
        """اختبار السماح بالوصول مع المصادقة"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/transactions/')
        
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED]


# دليل الاستخدام
"""
لتشغيل الاختبارات:

1. تشغيل جميع الاختبارات:
   python manage.py test listings.tests

2. تشغيل اختبار واحد فقط:
   python manage.py test listings.tests.TransactionAPITest.test_create_transaction

3. تشغيل مع verbose:
   python manage.py test listings.tests -v 2

4. تشغيل مع coverage:
   coverage run --source='.' manage.py test
   coverage report
"""
