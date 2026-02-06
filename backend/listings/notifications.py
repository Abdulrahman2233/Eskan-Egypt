# listings/notifications.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import Property


def send_property_approved_email(property_obj: Property):
    """
    إرسال بريد إلكتروني عند الموافقة على العقار
    """
    if not property_obj.owner or not property_obj.owner.user.email:
        return False

    try:
        subject = f"✅ تم الموافقة على عقارك: {property_obj.name}"
        
        context = {
            'property_name': property_obj.name,
            'property_price': property_obj.price,
            'property_area': property_obj.area.name if property_obj.area else 'غير محدد',
            'owner_name': property_obj.owner.user.get_full_name() or property_obj.owner.user.username,
            'approval_notes': property_obj.approval_notes or 'تمت الموافقة على عقارك بنجاح',
            'property_url': f"{settings.FRONTEND_URL}/property/{property_obj.id}",
            'dashboard_url': f"{settings.FRONTEND_URL}/dashboard/my-properties",
        }
        
        html_message = render_to_string('email/property_approved.html', context)
        
        send_mail(
            subject,
            f'تم الموافقة على عقارك: {property_obj.name}',
            settings.DEFAULT_FROM_EMAIL,
            [property_obj.owner.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending approval email: {e}")
        return False


def send_property_rejected_email(property_obj: Property):
    """
    إرسال بريد إلكتروني عند رفض العقار
    """
    if not property_obj.owner or not property_obj.owner.user.email:
        return False

    try:
        subject = f"❌ تم رفض عقارك: {property_obj.name}"
        
        context = {
            'property_name': property_obj.name,
            'property_price': property_obj.price,
            'property_area': property_obj.area.name if property_obj.area else 'غير محدد',
            'owner_name': property_obj.owner.user.get_full_name() or property_obj.owner.user.username,
            'rejection_reason': property_obj.approval_notes or 'لم يتم تحديد السبب',
            'resubmit_url': f"{settings.FRONTEND_URL}/dashboard/my-rejected",
            'support_email': settings.SUPPORT_EMAIL,
        }
        
        html_message = render_to_string('email/property_rejected.html', context)
        
        send_mail(
            subject,
            f'تم رفض عقارك: {property_obj.name}',
            settings.DEFAULT_FROM_EMAIL,
            [property_obj.owner.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending rejection email: {e}")
        return False


def send_property_submitted_email(property_obj: Property):
    """
    إرسال بريد تأكيد عند إرسال عقار للمراجعة
    """
    if not property_obj.owner or not property_obj.owner.user.email:
        return False

    try:
        subject = f"📬 تم استقبال عقارك: {property_obj.name}"
        
        context = {
            'property_name': property_obj.name,
            'property_price': property_obj.price,
            'property_area': property_obj.area.name if property_obj.area else 'غير محدد',
            'owner_name': property_obj.owner.user.get_full_name() or property_obj.owner.user.username,
            'submitted_date': property_obj.submitted_at.strftime("%Y-%m-%d %H:%M") if property_obj.submitted_at else '',
            'dashboard_url': f"{settings.FRONTEND_URL}/dashboard/my-properties",
        }
        
        html_message = render_to_string('email/property_submitted.html', context)
        
        send_mail(
            subject,
            f'تم استقبال عقارك: {property_obj.name}',
            settings.DEFAULT_FROM_EMAIL,
            [property_obj.owner.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending submission email: {e}")
        return False
