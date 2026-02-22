"""
Script to add Alexandria areas to the database
تم إنشاء هذا الملف لإضافة جميع مناطق الإسكندرية إلى قاعدة البيانات
"""

import os
import django

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from listings.models import Area

# قائمة مناطق الإسكندرية
alexandria_areas = [
    'أبو قير',
    'الإسكندرية',
    'الإبراهيمية',
    'الأزاريطة',
    'الأنفوشي',
    'الحضرة',
    'الدخيلة',
    'السرايا',
    'السيوف',
    'الشاطبي',
    'العجمي',
    'العصافرة',
    'العطارين',
    'باكوس',
    'بحري',
    'بولكلي',
    'جليم',
    'جناكليس',
    'الجمرك',
    'العامرية',
    'كليوباترا',
    'ميامي',
    'رأس التين',
    'رشدي',
    'زيزينيا',
    'سان ستيفانو',
    'سابا باشا',
    'سموحة',
    'سيدي بشر',
    'سيدي جابر',
    'شدس',
    'صفر',
    'فيكتوريا',
    'فلمنج',
    'كرموز',
    'كفر عبده',
    'كوم الدكة',
    'كامب شيزار',
    'اللبان',
    'لوران',
    'محرم بك',
    'محطة الرمل',
    'المندرة',
    'المنشية',
    'ميدان المنشية',
    'الورديان',
]

def add_areas():
    """إضافة المناطق إلى قاعدة البيانات"""
    added_count = 0
    skipped_count = 0
    
    for area_name in alexandria_areas:
        area, created = Area.objects.get_or_create(name=area_name)
        if created:
            added_count += 1
            print(f"✓ تم إضافة: {area_name}")
        else:
            skipped_count += 1
            print(f"⊘ موجود مسبقاً: {area_name}")
    
    print(f"\n{'='*50}")
    print(f"تم إضافة: {added_count} مناطق")
    print(f"موجود مسبقاً: {skipped_count} مناطق")
    print(f"إجمالي: {added_count + skipped_count} منطقة")
    print(f"{'='*50}")

if __name__ == '__main__':
    add_areas()
