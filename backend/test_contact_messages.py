#!/usr/bin/env python
"""
اختبار endpoint رسائل التواصل
"""

import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from listings.models import ContactMessage

User = get_user_model()

print("\n" + "="*60)
print("اختبار Endpoint رسائل التواصل")
print("="*60)

# 1. إنشاء رسائل اختبار
print("\n1️⃣  جاري إنشاء رسائل اختبار...")
ContactMessage.objects.all().delete()
for i in range(5):
    ContactMessage.objects.create(
        name=f"المرسل {i+1}",
        email=f"sender{i+1}@example.com",
        phone=f"0501234{i:03d}",
        subject=f"موضوع الرسالة {i+1}",
        message=f"محتوى الرسالة {i+1} - هذا اختبار للتحقق من أن الرسائل يتم حفظها بشكل صحيح",
        is_read=i % 2 == 0,
        is_archived=False
    )
print(f"✅ تم إنشاء {ContactMessage.objects.count()} رسائل اختبار")

# 2. اختبار الوصول بدون مصادقة
print("\n2️⃣  اختبار الوصول بدون مصادقة (GET)...")
client = Client()
response = client.get('/api/contact-messages/')
print(f"Response Status: {response.status_code}")
if response.status_code == 401:
    print("✅ تم الرفع بنجاح - المصادقة مطلوبة (401)")
else:
    print(f"⚠️ غير متوقع - الحالة: {response.status_code}")

# 3. إنشاء admin user
print("\n3️⃣  جاري إنشاء admin user...")
User.objects.filter(username='test_admin').delete()
admin_user = User.objects.create_superuser(
    username='test_admin',
    email='admin@example.com',
    password='test123456'
)
token = Token.objects.get_or_create(user=admin_user)[0]
print(f"✅ تم إنشاء admin user: {admin_user.username}")
print(f"✅ التوكن: {token.key}")

# 4. اختبار الوصول مع مصادقة
print("\n4️⃣  اختبار الوصول مع مصادقة (GET)...")
response = client.get(
    '/api/contact-messages/',
    HTTP_AUTHORIZATION=f'Token {token.key}'
)
print(f"Response Status: {response.status_code}")
if response.status_code == 200:
    data = json.loads(response.content)
    print(f"✅ تم الحصول على البيانات بنجاح")
    
    # فحص صيغة البيانات
    if isinstance(data, dict) and 'results' in data:
        print(f"   - صيغة البيانات: Paginated")
        print(f"   - عدد الرسائل: {len(data['results'])}")
        print(f"   - الإجمالي: {data.get('count', len(data['results']))}")
        if data['results']:
            first_msg = data['results'][0]
            print(f"   - أول رسالة: {first_msg.get('subject', 'بدون موضوع')}")
    elif isinstance(data, list):
        print(f"   - صيغة البيانات: Array")
        print(f"   - عدد الرسائل: {len(data)}")
        if data:
            print(f"   - أول رسالة: {data[0].get('subject', 'بدون موضوع')}")
else:
    print(f"❌ خطأ: {response.status_code}")
    print(f"   المحتوى: {response.content.decode()[:200]}")

# 5. اختبار إرسال رسالة جديدة (بدون مصادقة)
print("\n5️⃣  اختبار إرسال رسالة جديدة (POST - بدون مصادقة)...")
new_message_data = {
    "name": "مرسل جديد",
    "email": "new_sender@example.com",
    "phone": "0501234567",
    "subject": "رسالة اختبار من API",
    "message": "هذه رسالة اختبار للتحقق من أن الـ API تعمل بشكل صحيح"
}
response = client.post(
    '/api/contact-messages/',
    data=json.dumps(new_message_data),
    content_type='application/json'
)
print(f"Response Status: {response.status_code}")
if response.status_code in [201, 200]:
    print("✅ تم إرسال الرسالة بنجاح")
    data = json.loads(response.content)
    print(f"   الرسالة ID: {data.get('data', {}).get('id', 'غير معروف')}")
else:
    print(f"❌ خطأ: {response.status_code}")
    print(f"   المحتوى: {response.content.decode()[:200]}")

print("\n" + "="*60)
print("انتهى الاختبار")
print("="*60 + "\n")
