# 🔧 إصلاح مشكلة عدم ظهور العقارات

## المشكلة الرئيسية
الباكند لم يكن يعرض العقارات للفرونتند لأن Property model كان يفتقد عدة حقول مهمة.

## الحقول الناقصة التي تم إضافتها:
1. **status** - حالة العقار (draft, pending, approved, rejected)
2. **owner** - صاحب العقار (ForeignKey إلى UserProfile)
3. **submitted_at** - وقت إرسال العقار للموافقة
4. **approved_by** - الشخص الذي وافق على العقار (ForeignKey إلى UserProfile)
5. **approval_notes** - ملاحظات الموافقة أو الرفض

## 🔧 الخطوات المتخذة:

### 1. تحديث النموذج (Property Model)
**ملف:** `backend/listings/models.py`
- أضيف STATUS_CHOICES مع الخيارات: draft, pending, approved, rejected
- أضيف status field مع default='draft'
- أضيف owner (ForeignKey) يشير إلى UserProfile
- أضيف submitted_at (DateTimeField) nullable
- أضيف approved_by (ForeignKey) يشير إلى UserProfile
- أضيف approval_notes (TextField) نصي

### 2. إنشاء Migration
**ملف:** `backend/listings/migrations/0005_add_approval_fields.py`
- ينشئ migration جديد يضيف الحقول الخمسة للـ database
- يعتمد على users migration 0001_initial

### 3. تحديث Serializer
**ملف:** `backend/listings/serializers.py`
- أضيف status و status_display للـ fields
- أضيف owner و owner_name للـ fields
- أضيف approval_notes و submitted_at و approved_by
- جعل status و status_display read-only

### 4. تحديث Views
**ملف:** `backend/listings/views.py`
- تعديل get_queryset() لإظهار العقارات مع status في ['approved', 'draft']
- تحديث error handling لاستخدام status القديم

### 5. تحديث Frontend API
**ملف:** `src/api.ts`
- إصلاح fetchPropertiesByStatus() ليستخدم query params بدل مسار مختلف
- إصلاح fetchApprovedProperties() ليستخدم status parameter
- إصلاح approveProperty() و rejectProperty() لاستخدام approval_notes
- إصلاح searchProperties() لاستخدام المسار الصحيح

### 6. تحديث Django Admin
**ملف:** `backend/listings/admin.py`
- أضيف status و owner للـ list_display
- أضيف status للـ list_filter
- أضيف fieldsets جديد للموافقات
- أضيف status_badge() دالة لعرض حالة العقار بألوان مختلفة

### 7. إنشاء Management Command
**ملف:** `backend/listings/management/commands/update_properties.py`
- يحدث العقارات القديمة (status='draft') إلى 'approved'
- يعطي إحصائيات للعقارات بكل حالة

## 🚀 كيفية التطبيق على Hosting:

### على PythonAnywhere:

```bash
# 1. انتقل إلى المشروع
cd /home/Abdo238923/eskan_com

# 2. فعّل البيئة الافتراضية
source venv/bin/activate

# 3. تطبيق الـ Migrations
cd backend
python manage.py migrate

# 4. تشغيل management command لتحديث البيانات
python manage.py update_properties

# 5. جمع الـ static files (اختياري إذا لزم الأمر)
python manage.py collectstatic --noinput
```

### على البيانات الموجودة:
- العقارات الموجودة التي لم تملك owner ستبقى بـ owner=NULL
- العقارات ستكون بـ status='draft' initially
- بعد تشغيل management command، ستتحول إلى 'approved' لتظهر للمستخدمين

## ✅ النتائج المتوقعة:

1. العقارات ستظهر بشكل صحيح على الفرونتند
2. المستخدمون الجدد سيرون العقارات المُوافق عليها
3. الـ Admin يمكنه الموافقة/رفض العقارات الجديدة
4. كل عقار سيملك معلومات owner وحالة (status)

## 🔐 ملاحظات أمنية:

- الـ status field يتحكم في من يرى العقار
- Admin فقط يمكنه رؤية جميع العقارات
- المستخدم العادي يرى عقاراته + المُوافق عليها
- الزائر يرى فقط المُوافق عليها و الـ draft

## 📝 الملفات المعدلة:
1. ✅ backend/listings/models.py
2. ✅ backend/listings/migrations/0005_add_approval_fields.py
3. ✅ backend/listings/serializers.py
4. ✅ backend/listings/views.py
5. ✅ backend/listings/admin.py
6. ✅ backend/listings/management/commands/update_properties.py
7. ✅ src/api.ts
