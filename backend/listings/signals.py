"""
Signals for tracking user activities on properties and user accounts
"""
from django.db.models.signals import post_save, post_delete, pre_save
from django.db.models import Q
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Property, ActivityLog, Notification, ContactMessage
from users.models import UserProfile


@receiver(post_save, sender=Property)
def log_property_activity(sender, instance, created, **kwargs):
    """
    Log property creation with complete details
    """
    try:
        # Only log if the property has an owner and it's a new property
        if created and instance.owner:
            # Build complete property details
            usage_type_display = dict(Property.USAGE_TYPES).get(instance.usage_type, instance.usage_type)
            status_display = dict(Property.STATUS_CHOICES).get(instance.status, instance.status)
            
            full_details = f"""
📋 **تم إضافة عقار جديد**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 **معلومات العقار الأساسية:**
  • الاسم: {instance.name}
  • المنطقة: {instance.area.name}
  • العنوان: {instance.address}
  • رقم الاتصال: {instance.contact}

💰 **معلومات السعر:**
  • السعر الحالي: {instance.price} ريال
  • السعر الأصلي: {instance.original_price if instance.original_price else 'بدون'}
  • نسبة الخصم: {instance.discount}%

🏢 **تفاصيل المساحة:**
  • عدد الغرف: {instance.rooms}
  • عدد الأسرة: {instance.beds}
  • عدد الحمامات: {instance.bathrooms}
  • المساحة: {instance.size} متر مربع
  • الطابق: {instance.floor}

⚙️ **المواصفات:**
  • النوع: {usage_type_display}
  • مفروش: {'نعم' if instance.furnished else 'لا'}
  • مميز: {'نعم' if instance.featured else 'لا'}
  • الحالة: {status_display}

📍 **الموقع الجغرافي:**
  • خط العرض: {instance.latitude if instance.latitude else 'بدون'}
  • خط الطول: {instance.longitude if instance.longitude else 'بدون'}

📝 **الوصف:**
{instance.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ تاريخ الإضافة: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""
            
            ActivityLog.objects.create(
                user=instance.owner,
                action='create_property',
                content_type='property',
                object_id=str(instance.id),
                object_name=instance.name,
                description=full_details
            )
    except Exception as e:
        # Log the error but don't break the save operation
        print(f"Error logging property activity: {str(e)}")


@receiver(post_save, sender=Property)
def log_property_soft_delete(sender, instance, created, **kwargs):
    """
    Log property soft deletion (is_deleted = True)
    """
    try:
        # Check if this is a soft delete (is_deleted changed from False to True)
        if not created and instance.is_deleted:
            # Check if there's already a log for this deletion to avoid duplicates
            existing_log = ActivityLog.objects.filter(
                action='delete_property',
                object_id=str(instance.id),
                description__icontains=instance.deleted_at.strftime('%Y-%m-%d') if instance.deleted_at else ''
            ).first()
            
            if existing_log:
                return
            
            if instance.owner:
                usage_type_display = dict(Property.USAGE_TYPES).get(instance.usage_type, instance.usage_type)
                status_display = dict(Property.STATUS_CHOICES).get(instance.status, instance.status)
                deleted_by = instance.deleted_by.user.username if instance.deleted_by else 'نظام'
                
                full_details = f"""
📋 **تم حذف عقار (حذف منطقي)**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 **معلومات العقار الأساسية:**
  • الاسم: {instance.name}
  • المنطقة: {instance.area.name}
  • العنوان: {instance.address}
  • رقم الاتصال: {instance.contact}

💰 **معلومات السعر:**
  • السعر الحالي: {instance.price} ريال
  • السعر الأصلي: {instance.original_price if instance.original_price else 'بدون'}
  • نسبة الخصم: {instance.discount}%

🏢 **تفاصيل المساحة:**
  • عدد الغرف: {instance.rooms}
  • عدد الأسرة: {instance.beds}
  • عدد الحمامات: {instance.bathrooms}
  • المساحة: {instance.size} متر مربع
  • الطابق: {instance.floor}

⚙️ **المواصفات:**
  • النوع: {usage_type_display}
  • مفروش: {'نعم' if instance.furnished else 'لا'}
  • مميز: {'نعم' if instance.featured else 'لا'}
  • الحالة: {status_display}

📍 **الموقع الجغرافي:**
  • خط العرض: {instance.latitude if instance.latitude else 'بدون'}
  • خط الطول: {instance.longitude if instance.longitude else 'بدون'}

👤 **معلومات الحذف:**
  • تم الحذف بواسطة: {deleted_by}
  • تاريخ الحذف: {instance.deleted_at.strftime('%Y-%m-%d %H:%M:%S') if instance.deleted_at else 'غير محدد'}

📝 **الوصف:**
{instance.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ تاريخ الإضافة: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""
                
                ActivityLog.objects.create(
                    user=instance.deleted_by if instance.deleted_by else instance.owner,
                    action='delete_property',
                    content_type='property',
                    object_id=str(instance.id),
                    object_name=instance.name,
                    description=full_details
                )
    except Exception as e:
        # Log the error but don't break the save operation
        print(f"Error logging property soft deletion: {str(e)}")


@receiver(post_delete, sender=Property)
def log_property_deletion(sender, instance, **kwargs):
    """
    Log property deletion with complete details
    """
    try:
        if instance.owner:
            # Build complete property details
            usage_type_display = dict(Property.USAGE_TYPES).get(instance.usage_type, instance.usage_type)
            status_display = dict(Property.STATUS_CHOICES).get(instance.status, instance.status)
            
            full_details = f"""
📋 **تم حذف عقار**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 **معلومات العقار الأساسية:**
  • الاسم: {instance.name}
  • المنطقة: {instance.area.name}
  • العنوان: {instance.address}
  • رقم الاتصال: {instance.contact}

💰 **معلومات السعر:**
  • السعر الحالي: {instance.price} ريال
  • السعر الأصلي: {instance.original_price if instance.original_price else 'بدون'}
  • نسبة الخصم: {instance.discount}%

🏢 **تفاصيل المساحة:**
  • عدد الغرف: {instance.rooms}
  • عدد الأسرة: {instance.beds}
  • عدد الحمامات: {instance.bathrooms}
  • المساحة: {instance.size} متر مربع
  • الطابق: {instance.floor}

⚙️ **المواصفات:**
  • النوع: {usage_type_display}
  • مفروش: {'نعم' if instance.furnished else 'لا'}
  • مميز: {'نعم' if instance.featured else 'لا'}
  • الحالة: {status_display}

📍 **الموقع الجغرافي:**
  • خط العرض: {instance.latitude if instance.latitude else 'بدون'}
  • خط الطول: {instance.longitude if instance.longitude else 'بدون'}

📝 **الوصف:**
{instance.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ تاريخ الإضافة: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}
⏰ تاريخ الحذف: {__import__('django.utils', fromlist=['timezone']).timezone.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
            
            ActivityLog.objects.create(
                user=instance.owner,
                action='delete_property',
                content_type='property',
                object_id=str(instance.id),
                object_name=instance.name,
                description=full_details
            )
    except Exception as e:
        # Log the error but don't break the delete operation
        print(f"Error logging property deletion: {str(e)}")


# ============ Notifications Signals ============

@receiver(post_save, sender=Property)
def create_new_property_notification(sender, instance, created, **kwargs):
    """
    إرسال إشعار عند إضافة عقار جديد بانتظار الموافقة
    ⚠️ معطل - لا يتم إرسال إشعارات عند إضافة عقار جديد
    """
    # تم تعطيل هذه الميزة - لا يتم إنشاء إشعارات
    pass


@receiver(post_save, sender=Property)
def create_property_approval_notification(sender, instance, created, update_fields=None, **kwargs):
    """
    إرسال إشعار عند الموافقة على عقار
    ⚠️ معطل - لا يتم إرسال إشعارات للموافقات
    """
    # تم تعطيل هذه الميزة بالكامل - تم طلب عدم إرسال إشعارات للموافقات
    pass


@receiver(post_save, sender=Property)
def create_property_rejection_notification(sender, instance, created, update_fields=None, **kwargs):
    """
    إرسال إشعار عند رفض عقار
    """
    try:
        # التحقق من أن الحالة تغيرت إلى 'rejected'
        if not created and instance.status == 'rejected' and instance.owner:
            # إرسال إشعار للمالك
            Notification.objects.create(
                recipient=instance.owner,
                notification_type='rejection',
                title='تم رفض عقارك',
                description=f'تم رفض عقار: {instance.name}. السبب: {instance.approval_notes or "لم يتم تحديد السبب"}',
                related_property=instance,
                related_user=instance.approved_by
            )
    except Exception as e:
        print(f"Error creating property rejection notification: {str(e)}")


@receiver(post_save, sender=Property)
def create_high_views_notification(sender, instance, created, **kwargs):
    """
    إرسال إشعار عند وصول المشاهدات إلى حد معين
    """
    try:
        if not created and instance.owner and instance.views > 0:
            # إذا وصلت المشاهدات إلى 50, 100, 200, إلخ
            milestone_views = [50, 100, 200, 500, 1000, 2000]
            
            for milestone in milestone_views:
                if instance.views == milestone:
                    Notification.objects.create(
                        recipient=instance.owner,
                        notification_type='view',
                        title='مشاهدات عالية',
                        description=f'عقار "{instance.name}" وصلت مشاهداته إلى {instance.views} مشاهدة 🎉',
                        related_property=instance
                    )
                    break
    except Exception as e:
        print(f"Error creating high views notification: {str(e)}")


@receiver(post_save, sender=User)
def create_new_user_notification(sender, instance, created, **kwargs):
    """
    إرسال إشعار للمسؤولين عند تسجيل مستخدم جديد
    """
    try:
        if created:
            # التحقق من وجود ملف المستخدم
            try:
                profile = instance.profile
            except:
                # إذا لم يكن هناك profile، لا نرسل الإشعار الآن
                # سيتم إرساله لاحقاً عند إنشاء Profile
                return
            
            # الحصول على جميع المسؤولين (admins و staff)
            admins = UserProfile.objects.filter(
                Q(user_type='admin') | Q(user__is_staff=True),
                user__is_active=True
            ).exclude(user=instance).values_list('user', flat=True)
            
            # بيانات المستخدم الجديد
            user_type_display = dict(UserProfile.USER_TYPE_CHOICES).get(
                profile.user_type,
                profile.user_type
            )
            
            # إنشاء إشعارات للمسؤولين
            for admin_id in admins:
                try:
                    admin_user = User.objects.get(id=admin_id)
                    admin_profile = admin_user.profile
                    
                    Notification.objects.create(
                        recipient=admin_profile,
                        notification_type='user',
                        title='مستخدم جديد',
                        description=f'تم تسجيل مستخدم جديد: {instance.username} ({user_type_display})\n📧 البريد: {instance.email}',
                    )
                except Exception as e:
                    print(f"Error creating notification for admin {admin_id}: {str(e)}")
                    
    except Exception as e:
        print(f"Error creating new user notification: {str(e)}")


@receiver(post_save, sender=UserProfile)
def create_new_user_profile_notification(sender, instance, created, **kwargs):
    """
    إرسال إشعار للمسؤولين عند تسجيل مستخدم جديد (عند إنشاء Profile)
    """
    try:
        if created:
            # الحصول على جميع المسؤولين (admins و staff)
            admins = UserProfile.objects.filter(
                Q(user_type='admin') | Q(user__is_staff=True),
                user__is_active=True
            ).exclude(id=instance.id).values_list('user', flat=True)
            
            # بيانات المستخدم الجديد
            user_type_display = dict(UserProfile.USER_TYPE_CHOICES).get(
                instance.user_type,
                instance.user_type
            )
            
            # إنشاء إشعارات للمسؤولين
            for admin_id in admins:
                try:
                    admin_user = User.objects.get(id=admin_id)
                    admin_profile = admin_user.profile
                    
                    Notification.objects.create(
                        recipient=admin_profile,
                        notification_type='user',
                        title='مستخدم جديد',
                        description=f'تم تسجيل مستخدم جديد: {instance.user.username} ({user_type_display})\n📧 البريد: {instance.user.email}',
                    )
                except Exception as e:
                    print(f"Error creating notification for admin {admin_id}: {str(e)}")
                    
    except Exception as e:
        print(f"Error creating new user profile notification: {str(e)}")


@receiver(post_save, sender=ContactMessage)
def create_new_message_notification(sender, instance, created, **kwargs):
    """
    إرسال إشعار للمسؤولين عند وصول رسالة تواصل جديدة
    """
    try:
        if created:
            # الحصول على جميع المسؤولين (admins و staff)
            admins = UserProfile.objects.filter(
                Q(user_type='admin') | Q(user__is_staff=True),
                user__is_active=True
            ).values_list('user', flat=True)
            
            # إنشاء إشعارات للمسؤولين
            for admin_id in admins:
                try:
                    admin_user = User.objects.get(id=admin_id)
                    admin_profile = admin_user.profile
                    
                    Notification.objects.create(
                        recipient=admin_profile,
                        notification_type='message',
                        title='رسالة تواصل جديدة',
                        description=f'رسالة جديدة من {instance.name}\n📧 البريد: {instance.email}\n📞 الموضوع: {instance.subject}',
                    )
                except Exception as e:
                    print(f"Error creating notification for admin {admin_id}: {str(e)}")
                    
    except Exception as e:
        print(f"Error creating new message notification: {str(e)}")