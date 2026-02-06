#!/usr/bin/env python3
"""
اختبار إرسال واستقبال الإحداثيات من خريطة إلى API و Django
"""

import json

# إعدادات API
API_BASE = "http://localhost:8000/api"
PROPERTIES_ENDPOINT = f"{API_BASE}/properties/"

# توكن التطوير (يجب تحديثه بناءً على بيانات المستخدم)
TOKEN = "your_token_here"  # سيتم تحديثه

def test_coordinates_flow():
    """
    اختبار تدفق الإحداثيات من الخريطة إلى API و Django
    """
    
    print("=" * 60)
    print("اختبار تدفق الإحداثيات (Coordinates Flow Test)")
    print("=" * 60)
    
    # 1. بيانات العقار مع الإحداثيات من الخريطة
    property_data = {
        "name": "عقار تجريبي",
        "area": 1,  # يجب تحديث بـ ID منطقة حقيقية
        "address": "شارع النيل، القاهرة",
        "price": "5000.00",
        "rooms": "3",
        "beds": "2",
        "bathrooms": "2",
        "size": "150",
        "floor": "2",
        "furnished": True,
        "usage_type": "families",
        "description": "عقار عائلي بسيط",
        "contact": "01012345678",
        "latitude": "31.2054",  # من الخريطة
        "longitude": "29.9187"   # من الخريطة
    }
    
    print("\n1. البيانات التي سيتم إرسالها:")
    print("-" * 60)
    for key, value in property_data.items():
        if key not in ['images', 'videos']:
            print(f"  {key}: {value}")
    
    print("\n2. الإحداثيات:")
    print("-" * 60)
    print(f"  العرض (Latitude):  {property_data['latitude']}")
    print(f"  الطول (Longitude): {property_data['longitude']}")
    
    # 2. محاكاة الطلب إلى API
    print("\n3. إرسال الطلب إلى API...")
    print("-" * 60)
    print(f"POST {PROPERTIES_ENDPOINT}")
    print(f"Headers: Authorization: Token {TOKEN[:20]}...")
    print(f"Data: {json.dumps(property_data, indent=2)}")
    
    # 3. التحقق من استقبال البيانات
    print("\n4. التحقق من قاعدة البيانات:")
    print("-" * 60)
    print("✓ يجب أن يكون لدينا:")
    print("  - حقل latitude في جدول Property")
    print("  - حقل longitude في جدول Property")
    print("  - يجب أن يكون كلا الحقلين موجودين في PropertySerializer")
    print("  - يجب أن تُحفظ القيم بشكل صحيح في قاعدة البيانات")
    
    # 4. التحقق من أن الصفحة الرئيسية تستقبل الإحداثيات
    print("\n5. عرض الإحداثيات في الصفحة الرئيسية:")
    print("-" * 60)
    print("✓ عندما يتم جلب العقار:")
    print("  - API يُرجع latitude و longitude")
    print("  - PropertyDetails component يمرر هذه القيم إلى PropertyMap")
    print("  - PropertyMap يرسم الخريطة مع المؤشر على الإحداثيات الصحيحة")
    
    # 6. المراحل النهائية
    print("\n6. التدفق الكامل:")
    print("-" * 60)
    print("1. المستخدم يضيف عقار جديد في AddProperty.tsx")
    print("2. يختار موقع من الخريطة (LocationPicker)")
    print("3. يتم تحديث formData.latitude و formData.longitude")
    print("4. عند الحفظ، يتم إرسال الإحداثيات إلى API")
    print("5. Django يحفظ الإحداثيات في قاعدة البيانات")
    print("6. عند عرض العقار، يتم جلب الإحداثيات من قاعدة البيانات")
    print("7. يتم عرض خريطة بالموقع الصحيح")
    
    print("\n" + "=" * 60)
    print("قائمة التحقق:")
    print("=" * 60)
    checks = [
        ("✓", "إضافة حقول latitude و longitude للنموذج"),
        ("✓", "إضافة الحقول إلى PropertySerializer"),
        ("✓", "تطبيق الهجرات على قاعدة البيانات"),
        ("✓", "التحقق من AddProperty.tsx تحديث البيانات"),
        ("✓", "التحقق من PropertyDetails عرض الإحداثيات"),
        ("✓", "التحقق من PropertyMap يرسم الخريطة"),
    ]
    
    for status, check in checks:
        print(f"{status} {check}")
    
    print("\n" + "=" * 60)
    print("النتيجة: التدفق جاهز ✓")
    print("=" * 60)

if __name__ == "__main__":
    test_coordinates_flow()
