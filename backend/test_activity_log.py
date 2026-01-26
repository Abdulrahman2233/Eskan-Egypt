"""
اختبار نظام ActivityLog
تشغيل: python manage.py shell < test_activity_log.py
"""

from django.utils import timezone
from listings.models import ActivityLog, Property, Area
from users.models import UserProfile
from django.contrib.auth.models import User

# عرض الأنشطة المسجلة حالياً
print("\n" + "="*60)
print("🔍 فحص سجلات النشاط")
print("="*60 + "\n")

# عرض عدد السجلات
total_activities = ActivityLog.objects.count()
print(f"📊 إجمالي السجلات: {total_activities}\n")

if total_activities > 0:
    # عرض آخر 5 أنشطة
    print("📋 آخر 5 أنشطة:\n")
    recent = ActivityLog.objects.all()[:5]
    
    for activity in recent:
        print(f"{'─'*60}")
        print(f"👤 المستخدم: {activity.user.user.username if activity.user else 'حسابات محذوفة'}")
        print(f"🏷️  النشاط: {activity.get_action_display()}")
        print(f"📦 نوع المحتوى: {activity.get_content_type_display()}")
        print(f"📝 الكائن: {activity.object_name}")
        print(f"ℹ️  الوصف: {activity.description}")
        print(f"⏰ التاريخ والوقت: {activity.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
        print()
    
    # إحصائيات حسب نوع النشاط
    print(f"\n{'─'*60}")
    print("📊 إحصائيات حسب نوع النشاط:\n")
    
    actions = ActivityLog.objects.values('action').distinct()
    for action in actions:
        action_name = action['action']
        count = ActivityLog.objects.filter(action=action_name).count()
        action_display = ActivityLog.objects.filter(action=action_name).first().get_action_display()
        print(f"  • {action_display}: {count} سجل")
    
    # إحصائيات حسب المستخدم
    print(f"\n{'─'*60}")
    print("👥 أكثر المستخدمين نشاطاً:\n")
    
    users = ActivityLog.objects.values('user__user__username').distinct()
    for user in users[:5]:
        username = user['user__user__username']
        count = ActivityLog.objects.filter(user__user__username=username).count()
        print(f"  • {username}: {count} نشاط")

else:
    print("⚠️  لا توجد سجلات نشاط حتى الآن")
    print("💡 سيتم تسجيل السجلات تلقائياً عند:")
    print("   • إضافة عقار جديد")
    print("   • حذف عقار")
    print("   • إنشاء حساب جديد")

print(f"\n{'='*60}\n")
