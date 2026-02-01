"""
Test script for Notifications system
اختبار نظام الإشعارات
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
from listings.models import Property, Area, Notification
from django.utils import timezone

print("=" * 80)
print("🧪 اختبار نظام الإشعارات")
print("=" * 80)

# 1. الحصول على أو إنشاء مستخدم Admin
print("\n1️⃣ إنشاء مستخدم Admin للاختبار...")
admin_user, created = User.objects.get_or_create(
    username='admin_test',
    defaults={'email': 'admin@test.com', 'is_staff': True}
)
admin_profile, _ = UserProfile.objects.get_or_create(
    user=admin_user,
    defaults={'user_type': 'admin', 'full_name': 'Admin Test'}
)
print(f"✅ Admin: {admin_user.username} (نوع: {admin_profile.user_type})")

# 2. الحصول على أو إنشاء مستخدم Landlord (مالك عقار)
print("\n2️⃣ إنشاء مستخدم Landlord للاختبار...")
landlord_user, created = User.objects.get_or_create(
    username='landlord_test',
    defaults={'email': 'landlord@test.com'}
)
landlord_profile, _ = UserProfile.objects.get_or_create(
    user=landlord_user,
    defaults={'user_type': 'landlord', 'full_name': 'مالك العقار'}
)
print(f"✅ Landlord: {landlord_user.username} (نوع: {landlord_profile.user_type})")

# 3. الحصول على أو إنشاء منطقة
print("\n3️⃣ إنشاء منطقة للاختبار...")
area, created = Area.objects.get_or_create(
    name='حي النرجس',
)
print(f"✅ منطقة: {area.name}")

# 4. إنشاء عقار جديد (يجب أن ينشئ إشعارات)
print("\n4️⃣ إنشاء عقار جديد...")
property_obj = Property.objects.create(
    name='فيلا حي النرجس',
    area=area,
    address='شارع النرجس 123',
    price=500000,
    rooms=4,
    beds=4,
    bathrooms=3,
    size=300,
    floor=1,
    furnished=True,
    usage_type='families',
    description='فيلا فاخرة في حي النرجس',
    contact='0501234567',
    owner=landlord_profile,
    status='pending'
)
print(f"✅ عقار: {property_obj.name}")
print(f"   - المعرف: {property_obj.id}")
print(f"   - المالك: {property_obj.owner.user.username}")
print(f"   - الحالة: {property_obj.get_status_display()}")

# 5. التحقق من الإشعارات المنشأة
print("\n5️⃣ التحقق من الإشعارات المنشأة...")
notifications = Notification.objects.all()
print(f"📊 إجمالي الإشعارات في النظام: {notifications.count()}")

admin_notifications = Notification.objects.filter(recipient=admin_profile)
print(f"📊 إشعارات Admin: {admin_notifications.count()}")

for notif in admin_notifications:
    print(f"\n   🔔 إشعار:")
    print(f"      - النوع: {notif.get_notification_type_display()}")
    print(f"      - العنوان: {notif.title}")
    print(f"      - الوصف: {notif.description}")
    print(f"      - مقروء: {'✅ نعم' if notif.is_read else '❌ لا'}")
    print(f"      - التاريخ: {notif.created_at.strftime('%Y-%m-%d %H:%M:%S')}")

# 6. اختبار تحديث حالة العقار إلى موافق عليه
print("\n\n6️⃣ تحديث حالة العقار إلى 'موافق عليه'...")
property_obj.status = 'approved'
property_obj.approved_by = admin_profile
property_obj.approval_notes = 'عقار ممتاز، تم الموافقة عليه بنجاح'
property_obj.save()
print(f"✅ تم تحديث العقار إلى: {property_obj.get_status_display()}")

# 7. التحقق من الإشعارات للمالك
print("\n7️⃣ التحقق من إشعارات المالك...")
landlord_notifications = Notification.objects.filter(recipient=landlord_profile)
print(f"📊 إشعارات المالك: {landlord_notifications.count()}")

for notif in landlord_notifications:
    print(f"\n   🔔 إشعار:")
    print(f"      - النوع: {notif.get_notification_type_display()}")
    print(f"      - العنوان: {notif.title}")
    print(f"      - الوصف: {notif.description}")
    print(f"      - مقروء: {'✅ نعم' if notif.is_read else '❌ لا'}")

# 8. اختبار تحديد الإشعار كمقروء
print("\n8️⃣ تحديد إشعار واحد كمقروء...")
if landlord_notifications.exists():
    notif = landlord_notifications.first()
    notif.mark_as_read()
    print(f"✅ تم تحديد الإشعار كمقروء")
    print(f"   - مقروء: {'✅ نعم' if notif.is_read else '❌ لا'}")
    print(f"   - وقت القراءة: {notif.read_at}")

# 9. اختبار عدد الإشعارات غير المقروءة
print("\n9️⃣ عدد الإشعارات غير المقروءة...")
unread_count = Notification.objects.filter(
    recipient=admin_profile,
    is_read=False
).count()
print(f"📊 إشعارات Admin غير المقروءة: {unread_count}")

# 10. معلومات ملخصة
print("\n\n📋 ملخص الاختبار:")
print(f"   - إجمالي الإشعارات: {Notification.objects.count()}")
print(f"   - إشعارات Admin: {admin_notifications.count()}")
print(f"   - إشعارات المالك: {landlord_notifications.count()}")
print(f"   - الإشعارات المقروءة: {Notification.objects.filter(is_read=True).count()}")
print(f"   - الإشعارات غير المقروءة: {Notification.objects.filter(is_read=False).count()}")

print("\n" + "=" * 80)
print("✅ اكتمل الاختبار بنجاح!")
print("=" * 80)
