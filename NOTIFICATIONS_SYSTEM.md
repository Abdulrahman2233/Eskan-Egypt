# نظام الإشعارات الحقيقي - Notification System 🔔

## نظرة عامة
تم تطوير نظام إشعارات حقيقي متكامل يوفر إشعارات فورية للمستخدمين عند حدوث أحداث معينة في التطبيق.

## المكونات الرئيسية

### 1. Backend (Django)

#### النموذج: `Notification`
**الموقع:** `backend/listings/models.py`

```python
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('property', 'عقار جديد'),
        ('message', 'رسالة جديدة'),
        ('user', 'مستخدم جديد'),
        ('view', 'مشاهدات عالية'),
        ('approval', 'موافقة على عقار'),
        ('rejection', 'رفض عقار'),
    ]
    
    id = UUIDField(primary_key=True)
    recipient = ForeignKey(UserProfile)  # المستقبل
    notification_type = CharField(choices=NOTIFICATION_TYPES)
    title = CharField()
    description = TextField()
    related_property = ForeignKey(Property, optional)
    related_user = ForeignKey(UserProfile, optional)
    is_read = BooleanField(default=False)
    read_at = DateTimeField(optional)
    created_at = DateTimeField(auto_now_add=True)
```

#### API Endpoints
**الموقع:** `backend/listings/urls.py` و `backend/listings/views/notifications.py`

| الطلب | الـ Endpoint | الوصف |
|------|-------------|-------|
| GET | `/api/notifications/` | جلب جميع إشعارات المستخدم |
| GET | `/api/notifications/{id}/` | جلب إشعار محدد |
| GET | `/api/notifications/unread-count/` | عدد الإشعارات غير المقروءة |
| GET | `/api/notifications/recent/` | آخر 10 إشعارات |
| POST | `/api/notifications/{id}/mark-as-read/` | تحديد كمقروء |
| POST | `/api/notifications/mark-all-as-read/` | تحديد الكل كمقروء |
| DELETE | `/api/notifications/{id}/` | حذف إشعار |
| DELETE | `/api/notifications/clear-all/` | حذف جميع الإشعارات |

#### Signals
**الموقع:** `backend/listings/signals.py`

يتم إنشاء الإشعارات تلقائياً عند حدوث الأحداث التالية:

1. **عقار جديد:**
   - يتم إرسال إشعار لجميع المسؤولين عند إضافة عقار جديد
   - النوع: `property`
   - المستقبل: جميع المسؤولين

2. **موافقة على عقار:**
   - يتم إرسال إشعار لمالك العقار عند الموافقة
   - النوع: `approval`
   - المستقبل: مالك العقار

3. **رفض عقار:**
   - يتم إرسال إشعار لمالك العقار عند الرفض
   - النوع: `rejection`
   - المستقبل: مالك العقار

4. **مشاهدات عالية:**
   - يتم إرسال إشعار عند وصول المشاهدات إلى عدد معين (50, 100, 200, 500, 1000, 2000)
   - النوع: `view`
   - المستقبل: مالك العقار

### 2. Frontend (React/TypeScript)

#### API Methods
**الموقع:** `src/api.ts`

```typescript
// جلب الإشعارات
export async function fetchNotifications(page?: number, pageSize?: number)

// جلب عدد الإشعارات غير المقروءة
export async function getUnreadNotificationsCount(): Promise<number>

// جلب آخر الإشعارات
export async function fetchRecentNotifications(limit = 10)

// تحديد كمقروء
export async function markNotificationAsRead(notificationId: string)

// تحديد الكل كمقروء
export async function markAllNotificationsAsRead()

// حذف إشعار
export async function deleteNotification(notificationId: string)

// حذف جميع الإشعارات
export async function clearAllNotifications()
```

#### مكون NotificationsPopover
**الموقع:** `src/components/dashboard/NotificationsPopover.tsx`

- يعرض الإشعارات في popover عند الضغط على زر الجرس
- يعدّل عدد الإشعارات غير المقروءة
- يسمح بتحديد الإشعارات كمقروءة
- يسمح بحذف الإشعارات
- يحدّث الإشعارات كل 10 ثواني عند فتح البوبوفر

## كيفية الاستخدام

### تشغيل الاختبار

```bash
cd backend
python test_notifications.py
```

الاختبار ينشئ:
1. مستخدم Admin
2. مستخدم Landlord
3. عقار جديد
4. ينتظر الإشعارات
5. يحدّث حالة العقار ويتحقق من الإشعارات

### إنشاء إشعار يدوياً

```python
from listings.models import Notification
from users.models import UserProfile

admin = UserProfile.objects.get(user_type='admin')
property_obj = Property.objects.first()

Notification.objects.create(
    recipient=admin,
    notification_type='property',
    title='عقار جديد',
    description='تم إضافة عقار جديد',
    related_property=property_obj
)
```

### معالجة الإشعارات في المكونات

```typescript
import { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from "@/api";

export function MyComponent() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data.results || []);
    };
    
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    // تحديث الواجهة
  };

  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>
          <h3>{notif.title}</h3>
          <p>{notif.description}</p>
          <button onClick={() => handleMarkAsRead(notif.id)}>
            تحديد كمقروء
          </button>
        </div>
      ))}
    </div>
  );
}
```

## معلومات الإشعارات

كل إشعار يحتوي على:

| الحقل | النوع | الوصف |
|------|-------|-------|
| `id` | UUID | معرف فريد للإشعار |
| `recipient` | UserProfile | المستخدم المستقبل |
| `notification_type` | String | نوع الإشعار |
| `title` | String | عنوان الإشعار |
| `description` | String | وصف الإشعار |
| `related_property` | Property | العقار المتعلق (اختياري) |
| `related_user` | UserProfile | المستخدم المتعلق (اختياري) |
| `is_read` | Boolean | هل تم قراءة الإشعار |
| `read_at` | DateTime | وقت قراءة الإشعار |
| `created_at` | DateTime | وقت إنشاء الإشعار |

## التكامل مع WebSockets (مستقبلي)

يمكن تحسين النظام في المستقبل بإضافة WebSockets لإشعارات فورية بدون الحاجة للتحديث اليدوي.

## الملفات المعدلة

### Backend
- ✅ `backend/listings/models.py` - إضافة نموذج Notification
- ✅ `backend/listings/serializers.py` - إضافة NotificationSerializer
- ✅ `backend/listings/views/notifications.py` - إنشاء NotificationViewSet
- ✅ `backend/listings/signals.py` - إضافة signals لإنشاء الإشعارات
- ✅ `backend/listings/urls.py` - إضافة notification endpoints
- ✅ `backend/listings/views/__init__.py` - تحديث الـ imports

### Frontend
- ✅ `src/api.ts` - API methods موجودة
- ✅ `src/components/dashboard/NotificationsPopover.tsx` - مكون محدّث

## اختبار الـ API

### جلب الإشعارات
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  https://your-api.com/api/notifications/
```

### تحديد كمقروء
```bash
curl -X POST \
  -H "Authorization: Token YOUR_TOKEN" \
  https://your-api.com/api/notifications/{id}/mark-as-read/
```

### جلب عدد غير المقروءة
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  https://your-api.com/api/notifications/unread-count/
```

## ملاحظات مهمة

1. **الأداء:** الإشعارات مفهرسة حسب المستقبل والوقت لأداء أفضل
2. **الأمان:** كل مستخدم يرى فقط إشعاراته الخاصة
3. **حذف البيانات:** الإشعارات لا تُحذف عند حذف العقار (soft delete)
4. **التوقيت:** يتم حساب الوقت بشكل نسبي (منذ 5 دقائق) من جانب الـ backend

## النتائج

✅ نظام إشعارات حقيقي متكامل  
✅ إشعارات تلقائية من backend  
✅ واجهة مستخدم سلسة في frontend  
✅ جميع الاختبارات تمر بنجاح  
✅ بدون أخطاء compilation
