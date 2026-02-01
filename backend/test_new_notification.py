"""
Test new property notification
اختبار إشعار عقار جديد بانتظار الموافقة
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
from listings.models import Property, Area, Notification

print("=" * 80)
print("🧪 اختبار إشعار عقار جديد")
print("=" * 80)

# حذف الإشعارات السابقة
print("\n🗑️ تنظيف الإشعارات السابقة...")
Notification.objects.all().delete()
print("✅ تم التنظيف")

# الحصول على البيانات
print("\n1️⃣ جلب البيانات المطلوبة...")
admin = UserProfile.objects.filter(user_type='admin').first()
area = Area.objects.first()
landlord = UserProfile.objects.filter(user_type='landlord').first()

if not all([admin, area, landlord]):
    print("❌ خطأ: البيانات المطلوبة غير موجودة")
    exit(1)

print(f"✅ Admin: {admin.user.username}")
print(f"✅ Area: {area.name}")
print(f"✅ Landlord: {landlord.user.username}")

# إنشاء عقار جديد
print("\n2️⃣ إنشاء عقار جديد...")
property_obj = Property.objects.create(
    name='فيلا جديدة - اختبار الإشعار',
    area=area,
    address='شارع الاختبار 999',
    price=600000,
    rooms=4,
    beds=3,
    bathrooms=2,
    size=280,
    floor=1,
    furnished=True,
    usage_type='families',
    description='عقار جديد لاختبار الإشعارات',
    contact='0509999999',
    owner=landlord
)
print(f"✅ تم إنشاء العقار: {property_obj.name}")

# التحقق من الإشعارات
print("\n3️⃣ التحقق من الإشعارات...")
notifications = Notification.objects.filter(recipient=admin)
print(f"📊 عدد إشعارات Admin: {notifications.count()}")

for notif in notifications:
    print(f"\n🔔 إشعار:")
    print(f"   - النوع: {notif.get_notification_type_display()}")
    print(f"   - العنوان: {notif.title}")
    print(f"   - الوصف: {notif.description}")
    print(f"   - العقار: {notif.related_property.name if notif.related_property else 'لا يوجد'}")
    print(f"   - المالك: {notif.related_user.user.username if notif.related_user else 'لا يوجد'}")

print("\n" + "=" * 80)
print("✅ نجح الاختبار!")
print("=" * 80)
