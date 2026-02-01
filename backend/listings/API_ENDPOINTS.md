# API Endpoints Reference

بعد إعادة تنظيم `views/`، جميع endpoints تبقى نفسها تماماً.

## Property Endpoints

### PropertyViewSet (properties.py)

```
GET    /api/properties/                    # قائمة العقارات المعتمدة
POST   /api/properties/                    # إنشاء عقار جديد
GET    /api/properties/{id}/               # تفاصيل عقار
DELETE /api/properties/{id}/               # حذف عقار (soft delete)

# إجراءات مخصصة
GET    /api/properties/my_properties/      # عقاراتي
GET    /api/properties/pending/            # العقارات المعلقة (admin)
GET    /api/properties/rejected/           # العقارات المرفوضة (admin)
GET    /api/properties/deleted/            # العقارات المحذوفة (admin)
POST   /api/properties/{id}/approve/       # الموافقة على عقار
POST   /api/properties/{id}/reject/        # رفض عقار
POST   /api/properties/{id}/resubmit/      # إعادة إرسال مرفوض
GET    /api/properties/featured/           # العقارات المميزة
GET    /api/properties/statistics/         # الإحصائيات
GET    /api/properties/audit_trail/        # سجل التدقيق
```

---

## Basic Endpoints

### AreaViewSet (basic.py)

```
GET    /api/areas/              # قائمة المناطق
GET    /api/areas/{id}/         # تفاصيل منطقة
```

### OfferViewSet (basic.py)

```
GET    /api/offers/             # العروض النشطة
GET    /api/offers/active/      # جميع العروض النشطة
GET    /api/offers/by_audience/ # عروض حسب الفئة المستهدفة
```

### ContactMessageViewSet (basic.py)

```
POST   /api/contact-messages/           # إرسال رسالة تواصل
GET    /api/contact-messages/           # قائمة الرسائل (admin)
GET    /api/contact-messages/unread/    # الرسائل غير المقروءة
POST   /api/contact-messages/{id}/mark_as_read/
POST   /api/contact-messages/{id}/mark_as_archived/
```

---

## Analytics Endpoints

### ActivityLogViewSet (analytics.py)

```
GET    /api/activity-logs/          # سجل النشاط (admin)
```

### DashboardAnalyticsViewSet (analytics.py)

```
GET    /api/analytics/summary/              # ملخص شامل
GET    /api/analytics/properties/           # إحصائيات العقارات
GET    /api/analytics/users/                # إحصائيات المستخدمين
GET    /api/analytics/property_types/       # توزيع الأنواع
GET    /api/analytics/areas/                # إحصائيات المناطق
GET    /api/analytics/offers/               # إحصائيات العروض
GET    /api/analytics/recent_activities/    # آخر الأنشطة
GET    /api/analytics/top_properties/       # أكثر عقارات مشاهدة
GET    /api/analytics/price_distribution/   # توزيع الأسعار
GET    /api/analytics/daily_activity/       # النشاط اليومي
GET    /api/analytics/contact_messages/     # إحصائيات الرسائل
GET    /api/analytics/top_owners/           # أفضل المالكين
GET    /api/analytics/device_stats/         # إحصائيات الأجهزة
```

### TransactionViewSet (analytics.py)

```
GET    /api/transactions/               # الصفقات
POST   /api/transactions/               # إنشاء صفقة
GET    /api/transactions/{id}/          # تفاصيل صفقة
GET    /api/transactions/my_transactions/
GET    /api/transactions/statistics/
GET    /api/transactions/by_property_type/
GET    /api/transactions/by_region/
GET    /api/transactions/by_account_type/
```

### VisitorViewSet (analytics.py)

```
GET    /api/visitors/                   # قائمة الزوار (admin)
POST   /api/visitors/record_visit/      # تسجيل زائر
GET    /api/visitors/today_count/       # عدد الزوار اليوم
GET    /api/visitors/total_count/       # إجمالي الزوار
```

---

## ملاحظات مهمة

✅ **جميع endpoints تعمل بنفس الطريقة**
- الاستيرادات من `views/` package
- الـ routing من `urls.py` لم يتغير
- لا توجد تأثيرات على الـ API

⚠️ **لا تنسَ:**
- الصلاحيات (authentication/permissions)
- معاملات الفلترة والبحث
- معاملات الفرز والترتيب

---

## المراجع

للحصول على التفاصيل الكاملة:
- `VIEWS_REFACTORING.md` - شرح تقني
- `QUICK_GUIDE.md` - دليل المطورين
- `views/__init__.py` - قائمة الاستيرادات

---

**آخر تحديث:** ✅ جلسة إعادة التنظيم الحالية
