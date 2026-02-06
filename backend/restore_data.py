"""
Restore database script - استعادة البيانات الأساسية
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
from listings.models import Property, Area

print("=" * 80)
print("🔄 استعادة البيانات الأساسية")
print("=" * 80)

# 1. إنشاء المناطق الأساسية
print("\n1️⃣ إنشاء المناطق الأساسية...")
areas_data = [
    'حي النرجس',
    'حي الملقا',
    'حي الروضة',
    'حي الشفاء',
    'حي المستجد',
    'حي الهرمان',
    'حي الصفا',
    'حي الخليج',
]

for area_name in areas_data:
    area, created = Area.objects.get_or_create(name=area_name)
    status = "✨ جديدة" if created else "✅ موجودة"
    print(f"   {status}: {area_name}")

# 2. إنشاء مستخدم Admin
print("\n2️⃣ إنشاء مستخدم Admin...")
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@eskan.com',
        'is_staff': True,
        'is_superuser': True
    }
)
admin_profile, _ = UserProfile.objects.get_or_create(
    user=admin_user,
    defaults={'user_type': 'admin', 'full_name': 'Admin'}
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print(f"   ✨ Admin جديد: {admin_user.username}")
else:
    print(f"   ✅ Admin موجود: {admin_user.username}")

# 3. إنشاء بعض مالكي العقارات
print("\n3️⃣ إنشاء مالكي العقارات...")
landlords_data = [
    {'username': 'landlord1', 'email': 'landlord1@eskan.com', 'name': 'محمد العتيبي'},
    {'username': 'landlord2', 'email': 'landlord2@eskan.com', 'name': 'سارة الشمري'},
    {'username': 'landlord3', 'email': 'landlord3@eskan.com', 'name': 'خالد الدوسري'},
]

landlords = []
for landlord_data in landlords_data:
    user, created = User.objects.get_or_create(
        username=landlord_data['username'],
        defaults={'email': landlord_data['email']}
    )
    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={'user_type': 'landlord', 'full_name': landlord_data['name']}
    )
    if created:
        user.set_password('landlord123')
        user.save()
        status = "✨ جديد"
    else:
        status = "✅ موجود"
    landlords.append(profile)
    print(f"   {status}: {user.username} ({landlord_data['name']})")

# 4. إنشاء عقارات نموذجية
print("\n4️⃣ إنشاء عقارات نموذجية...")

properties_data = [
    {
        'name': 'فيلا حي النرجس',
        'area': 'حي النرجس',
        'address': 'شارع النرجس 123',
        'price': 800000,
        'rooms': 5,
        'beds': 4,
        'bathrooms': 3,
        'size': 350,
        'floor': 1,
        'furnished': True,
        'usage_type': 'families',
        'description': 'فيلا فاخرة في حي النرجس مع حديقة واسعة',
        'contact': '0501234567',
        'status': 'pending',
        'owner_idx': 0
    },
    {
        'name': 'شقة حي الملقا',
        'area': 'حي الملقا',
        'address': 'شارع الملقا 456',
        'price': 350000,
        'rooms': 3,
        'beds': 2,
        'bathrooms': 2,
        'size': 150,
        'floor': 5,
        'furnished': False,
        'usage_type': 'families',
        'description': 'شقة حديثة في موقع ممتاز',
        'contact': '0502345678',
        'status': 'approved',
        'owner_idx': 1
    },
    {
        'name': 'استوديو حي الروضة',
        'area': 'حي الروضة',
        'address': 'شارع الروضة 789',
        'price': 180000,
        'rooms': 1,
        'beds': 1,
        'bathrooms': 1,
        'size': 60,
        'floor': 3,
        'furnished': True,
        'usage_type': 'studio',
        'description': 'استوديو صغير مفروش للطلاب والموظفين',
        'contact': '0503456789',
        'status': 'approved',
        'owner_idx': 2
    },
    {
        'name': 'فيلا حي الشفاء',
        'area': 'حي الشفاء',
        'address': 'شارع الشفاء 321',
        'price': 900000,
        'rooms': 6,
        'beds': 5,
        'bathrooms': 4,
        'size': 400,
        'floor': 1,
        'furnished': False,
        'usage_type': 'families',
        'description': 'فيلا حديثة بمواصفات عالية',
        'contact': '0504567890',
        'status': 'draft',
        'owner_idx': 0
    },
    {
        'name': 'شقة حي المستجد',
        'area': 'حي المستجد',
        'address': 'شارع المستجد 654',
        'price': 400000,
        'rooms': 4,
        'beds': 3,
        'bathrooms': 2,
        'size': 180,
        'floor': 4,
        'furnished': True,
        'usage_type': 'families',
        'description': 'شقة واسعة مفروشة بالكامل',
        'contact': '0505678901',
        'status': 'approved',
        'owner_idx': 1
    },
]

created_count = 0
for prop_data in properties_data:
    area = Area.objects.get(name=prop_data['area'])
    owner = landlords[prop_data['owner_idx']]
    
    prop, created = Property.objects.get_or_create(
        name=prop_data['name'],
        defaults={
            'area': area,
            'address': prop_data['address'],
            'price': prop_data['price'],
            'rooms': prop_data['rooms'],
            'beds': prop_data['beds'],
            'bathrooms': prop_data['bathrooms'],
            'size': prop_data['size'],
            'floor': prop_data['floor'],
            'furnished': prop_data['furnished'],
            'usage_type': prop_data['usage_type'],
            'description': prop_data['description'],
            'contact': prop_data['contact'],
            'status': prop_data['status'],
            'owner': owner,
        }
    )
    
    if created:
        created_count += 1
        status = "✨ جديد"
    else:
        status = "✅ موجود"
    
    print(f"   {status}: {prop.name} ({prop.get_status_display()})")

# 5. ملخص
print("\n\n📋 ملخص:")
total_areas = Area.objects.count()
total_properties = Property.objects.count()
total_users = UserProfile.objects.count()

print(f"   - المناطق: {total_areas}")
print(f"   - العقارات: {total_properties}")
print(f"   - المستخدمين: {total_users}")

print("\n" + "=" * 80)
print("✅ تمت استعادة البيانات الأساسية بنجاح!")
print("=" * 80)

print("\n📝 بيانات الدخول:")
print("   Admin:")
print("   - Username: admin")
print("   - Password: admin123")
print("\n   Landlords:")
print("   - Username: landlord1, landlord2, landlord3")
print("   - Password: landlord123")
