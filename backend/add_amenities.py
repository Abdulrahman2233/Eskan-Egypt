import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from listings.models import Amenity

# Delete existing amenities
Amenity.objects.all().delete()

amenities_data = [
    {
        "name": "تكييف مركزي",
        "icon": "wind",
        "description": "نظام تكييف مركزي حديث"
    },
    {
        "name": "مطبخ مجهز",
        "icon": "coffee",
        "description": "مطبخ مجهز بالأدوات الأساسية"
    },
    {
        "name": "إنترنت فائق السرعة",
        "icon": "wifi",
        "description": "اتصال إنترنت سريع وموثوق"
    },
    {
        "name": "موقف سيارات",
        "icon": "car",
        "description": "موقف سيارات خاص أو مشترك"
    },
    {
        "name": "أمن 24 ساعة",
        "icon": "shield",
        "description": "حراسة أمنية طوال اليوم"
    },
    {
        "name": "مصعد",
        "icon": "dooropen",
        "description": "مصعد كهربائي حديث"
    },
    {
        "name": "غسالة ملابس",
        "icon": "droplets",
        "description": "غسالة ملابس في الوحدة أو المبنى"
    },
    {
        "name": "تلفزيون ذكي",
        "icon": "tv",
        "description": "تلفزيون ذكي متصل بالإنترنت"
    },
    {
        "name": "أثاث",
        "icon": "sofa",
        "description": "أثاث مريح وعملي"
    },
    {
        "name": "حمام نظيف",
        "icon": "bath",
        "description": "حمام نظيف ومجهز"
    },
    {
        "name": "آلة غسيل",
        "icon": "washing",
        "description": "آلة غسيل ملابس"
    },
    {
        "name": "ميكروويف",
        "icon": "microwave",
        "description": "فرن ميكروويف"
    },
    {
        "name": "ثلاجة",
        "icon": "fridge",
        "description": "ثلاجة حديثة"
    },
    {
        "name": "مكيف هواء",
        "icon": "ac",
        "description": "مكيف هواء منفصل"
    },
    {
        "name": "دفاية",
        "icon": "heater",
        "description": "دفاية أو نظام تدفئة"
    },
    {
        "name": "شرفة",
        "icon": "balcony",
        "description": "شرفة مع إطلالة جميلة"
    },
    {
        "name": "حديقة",
        "icon": "garden",
        "description": "حديقة خاصة أو مشتركة"
    },
    {
        "name": "موقف سيارات خاص",
        "icon": "parking",
        "description": "موقف سيارات خاص"
    },
    {
        "name": "صالة رياضية",
        "icon": "gym",
        "description": "صالة رياضية متكاملة"
    },
    {
        "name": "حمام السباحة",
        "icon": "pool",
        "description": "حمام سباحة"
    },
]

# Create amenities
for amenity_data in amenities_data:
    amenity, created = Amenity.objects.get_or_create(
        name=amenity_data["name"],
        defaults={
            "icon": amenity_data["icon"],
            "description": amenity_data.get("description", ""),
            "is_active": True
        }
    )
    if created:
        print(f"✓ تم إضافة: {amenity.name}")
    else:
        print(f"- موجود بالفعل: {amenity.name}")

print(f"\n✅ تم إضافة/تحديث {Amenity.objects.count()} مميزة")
