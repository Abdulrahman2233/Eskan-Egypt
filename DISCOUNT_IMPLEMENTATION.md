# تطبيق نظام الخصم - وثائق التطوير

## نظرة عامة
تم إضافة نظام خصم كامل للعقارات مع دعم كامل من Backend (Django) إلى Frontend (React/TypeScript).

## التغييرات في Backend (Django)

### 1. نموذج قاعدة البيانات (models.py)
تمت إضافة حقلين جديدين إلى نموذج `Property`:

```python
original_price = models.DecimalField(
    max_digits=12, 
    decimal_places=2, 
    null=True, 
    blank=True, 
    verbose_name='السعر الأصلي'
)

discount = models.IntegerField(
    default=0, 
    validators=[MinValueValidator(0), MaxValueValidator(100)], 
    verbose_name='نسبة الخصم (%)'
)
```

**الخصائص:**
- `original_price`: السعر قبل الخصم (اختياري)
- `discount`: نسبة الخصم بالنسبة المئوية (0-100%)

### 2. API Serializer (serializers.py)
تمت إضافة الحقول الجديدة إلى `PropertySerializer`:

```python
fields = (
    ...
    'price', 'original_price', 'discount',
    ...
)
```

### 3. Django Admin (admin.py)
- تمت إضافة `discount` و `original_price` إلى `list_display`
- تمت إضافة الحقول إلى `fieldsets` لسهولة التحرير

### 4. Migration
تم إنشاء migration جديد:
```
0030_property_discount_property_original_price_and_more
```

## التغييرات في Frontend (React/TypeScript)

### 1. PropertyCard Component
تم إضافة عرض الخصم في بطاقة العقار:

**المميزات:**
- شارة خصم حمراء مع أيقونة Percent في الزاوية العلوية اليسرى
- عرض السعر الأصلي مع خط مرتفوع
- تغيير لون السعر الحالي للأحمر عند وجود خصم
- شارة خضراء تعرض مبلغ المدخرات

**البيانات المتوقعة:**
```typescript
interface Property {
  price: number;
  original_price?: number;
  discount?: number;
}
```

### 2. PropertyDetails Component (صفحة تفاصيل العقار)
تم إضافة عرض الخصم بشكل احترافي في صندوق السعر:

**المميزات:**
- شارة خصم متحركة في الأعلى
- عرض السعر الأصلي مع خط مرتفوع
- حساب وعرض مبلغ المدخرات الفعلي
- صندوق أخضر يعرض التوفير بالجنيه

```typescript
const savingsAmount = property.original_price 
  ? property.original_price - property.price 
  : 0;
```

## كيفية الاستخدام

### إضافة خصم لعقار عبر Django Admin:

1. اذهب إلى `Admin > Listings > Properties`
2. اختر العقار المراد إضافة خصم له
3. ملء الحقول:
   - **السعر**: السعر الحالي بعد الخصم
   - **السعر الأصلي**: السعر قبل الخصم
   - **نسبة الخصم**: النسبة المئوية (0-100)

### مثال:
- السعر الأصلي: 10,000 جنيه
- نسبة الخصم: 20%
- السعر الحالي: 8,000 جنيه
- المدخرات: 2,000 جنيه

## كيفية الاستقبال في Frontend

البيانات تأتي من API الخاص بـ Django:

```typescript
{
  "id": "uuid",
  "name": "اسم العقار",
  "price": 8000,
  "original_price": 10000,
  "discount": 20,
  "area": "المنطقة",
  ...
}
```

## الحسابات

### مبلغ المدخرات:
```
savings = original_price - price
```

### في PropertyDetails:
يتم حساب مبلغ المدخرات الفعلي بناءً على الفرق بين السعر الأصلي والحالي:

```typescript
const savingsAmount = property.original_price 
  ? property.original_price - property.price 
  : 0;
```

## ملاحظات مهمة

1. **الخصم اختياري**: إذا لم يتم تعيين خصم، سيظهر السعر الحالي فقط
2. **الحد الأقصى للخصم**: 100% (يمكن تعديله في الـ validator)
3. **التحقق**: يتم التحقق من أن الحقول تحتوي على أرقام صحيحة
4. **التوافقية**: الحقول الجديدة اختيارية (`null=True, blank=True`) لا تؤثر على البيانات القديمة

## اختبار الميزة

### في Django Admin:
1. اختر أي عقار
2. أضف سعراً أصلياً ونسبة خصم
3. احفظ البيانات

### في Frontend:
يجب أن تظهر:
- شارة الخصم الحمراء
- السعر الأصلي مع خط مرتفوع
- السعر الحالي بلون أحمر
- مبلغ المدخرات في صندوق أخضر

## الملفات المعدلة

### Backend:
- `backend/listings/models.py` - إضافة الحقول للنموذج
- `backend/listings/serializers.py` - إضافة الحقول للـ serializer
- `backend/listings/admin.py` - إضافة الحقول إلى Django Admin
- `backend/listings/migrations/0030_*.py` - Migration جديد

### Frontend:
- `src/components/PropertyCard.tsx` - إضافة عرض الخصم
- `src/pages/PropertyDetails.tsx` - إضافة عرض الخصم في الصفحة التفصيلية
- `src/api.ts` - لا تغيير (الـ API تقرأ البيانات تلقائياً)

## الدعم والصيانة

إذا واجهت أي مشاكل:
1. تأكد من تطبيق الـ migration على قاعدة البيانات
2. امسح الـ cache في الـ Frontend (localStorage)
3. أعد تحميل الصفحة
4. تحقق من أن البيانات تأتي من API بشكل صحيح في DevTools

---
تم التطبيق بتاريخ: 25 يناير 2026
