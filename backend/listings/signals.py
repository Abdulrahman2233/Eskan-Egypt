"""
Signals for tracking user activities on properties and user accounts
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Property, ActivityLog


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

