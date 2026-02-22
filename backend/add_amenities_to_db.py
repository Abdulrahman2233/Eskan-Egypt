"""
Script to add all amenities/features to the database
تم إنشاء هذا الملف لإضافة جميع المميزات إلى قاعدة البيانات
"""

import os
import django

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from listings.models import Amenity

# قائمة المميزات مع الأيقونات والأسماء
amenities_data = [
    ('wind', 'تكييف مركزي', 'نظام تكييف مركزي في المكان'),
    ('coffee', 'مطبخ مجهز', 'مطبخ مجهز بجميع الأدوات والأجهزة'),
    ('wifi', 'إنترنت فائق السرعة', 'اتصال إنترنت سريع وموثوق'),
    ('car', 'موقف سيارات', 'موقف متاح للسيارات'),
    ('shield', 'أمن 24 ساعة', 'حراسة أمنية على مدار الساعة'),
    ('dooropen', 'مصعد', 'مصعد كهربائي في المبنى'),
    ('droplets', 'غسالة ملابس', 'غسالة ملابس متاحة'),
    ('tv', 'تلفزيون ذكي', 'تلفزيون ذكي في المكان'),
    ('sofa', 'أثاث', 'أثاث كامل في المكان'),
    ('bath', 'حمام نظيف', 'حمامات نظيفة'),
    ('washing', 'آلة غسيل', 'آلة غسيل ملابس'),
    ('microwave', 'ميكروويف', 'فرن ميكروويف في المطبخ'),
    ('fridge', 'ثلاجة', 'ثلاجة في المكان'),
    ('ac', 'مكيف هواء', 'مكيف هواء منفصل'),
    ('heater', 'دفاية', 'دفاية كهربائية'),
    ('balcony', 'شرفة', 'شرفة جميلة'),
    ('garden', 'حديقة', 'حديقة خاصة'),
    ('parking', 'موقف سيارات خاص', 'موقف سيارات خاص بالمكان'),
    ('gym', 'صالة رياضية', 'صالة رياضية مجهزة'),
    ('pool', 'حمام السباحة', 'حمام سباحة في المبنى'),
    ('zap', 'عداد كهرباء كارت', 'عداد كهرباء بطريقة الكارت'),
    ('water_card', 'عداد مياه كارت', 'عداد مياه بطريقة الكارت'),
    ('receipt', 'عداد كهرباء فاتورة', 'عداد كهرباء بطريقة الفاتورة'),
    ('thermometer', 'سخان مياه', 'سخان مياه ساخن'),
    ('filter', 'فلتر مياه', 'فلتر مياه للشرب'),
    ('flame', 'غاز طبيعي', 'اتصال بغاز طبيعي'),
    ('bottle', 'اسطوانة غاز', 'اسطوانة غاز للطهي'),
]

def add_amenities():
    """إضافة المميزات إلى قاعدة البيانات"""
    added_count = 0
    skipped_count = 0
    
    for icon, name, description in amenities_data:
        amenity, created = Amenity.objects.get_or_create(
            name=name,
            defaults={
                'icon': icon,
                'description': description,
                'is_active': True
            }
        )
        if created:
            added_count += 1
            print(f"✓ تم إضافة: {name}")
        else:
            skipped_count += 1
            print(f"⊘ موجودة مسبقاً: {name}")
    
    print(f"\n{'='*50}")
    print(f"تم إضافة: {added_count} مميزات")
    print(f"موجودة مسبقاً: {skipped_count} مميزات")
    print(f"إجمالي: {added_count + skipped_count} مميزة")
    print(f"{'='*50}")

if __name__ == '__main__':
    add_amenities()
