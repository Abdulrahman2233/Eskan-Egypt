"""
Areas, Offers, Messages ViewSets
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.throttling import AnonRateThrottle
from django.utils import timezone
from django.db import models

from ..models import Area, Offer, ContactMessage, Amenity
from ..serializers import AreaSerializer, OfferSerializer, ContactMessageSerializer, AmenitySerializer


class ContactRateThrottle(AnonRateThrottle):
    """Rate limiting for contact message submissions"""
    rate = '3/minute'


class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet لإدارة عرض المناطق الجغرافية
    
    المميزات:
    - عرض قائمة بجميع المناطق
    - البحث والفلترة حسب الاسم
    - Pagination مدمج
    
    الأذونات: AllowAny (للعموم)
    """
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # لا حاجة للـ Pagination للمناطق

    def get_queryset(self):
        """Annotate property counts to avoid N+1 queries"""
        from django.db.models import Count, Q
        return Area.objects.annotate(
            annotated_property_count=Count(
                'properties',
                filter=Q(properties__is_deleted=False, properties__status='approved')
            )
        )


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet لإدارة عرض المميزات والخدمات
    
    المميزات:
    - عرض قائمة بجميع المميزات النشطة
    - البحث والفلترة
    - محسنة للأداء
    
    الأذونات: AllowAny (للعموم)
    """
    queryset = Amenity.objects.filter(is_active=True)
    serializer_class = AmenitySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # لا حاجة للـ Pagination للمميزات
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering = ['name']


class OfferViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet لإدارة العروض الترويجية والخصومات
    
    المميزات:
    - عرض العروض النشطة فقط (ضمن التواريخ المحددة)
    - فلترة العروض حسب الفئة المستهدفة (طلاب، عائلات، الكل)
    - Endpoints خاصة:
        - /offers/active/ - جميع العروض النشطة
        - /offers/by_audience/?audience=students - عروض حسب الفئة
    
    الأذونات: AllowAny (للعموم)
    المراتب: حسب التاريخ أو نسبة الخصم
    """
    serializer_class = OfferSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'discount_percentage']
    ordering = ['-created_at']
    permission_classes = [AllowAny]

    def get_queryset(self):
        """جلب العروض النشطة"""
        now = timezone.now()
        return Offer.objects.filter(
            is_active=True,
            start_date__lte=now,
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=now)
        ).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def active(self, request):
        """جلب جميع العروض النشطة"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_audience(self, request):
        """جلب العروض حسب الفئة المستهدفة"""
        audience = request.query_params.get('audience', 'all')
        queryset = self.get_queryset().filter(
            models.Q(target_audience=audience) | models.Q(target_audience='all')
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet لإدارة رسائل التواصل من العملاء
    
    العمليات المدعومة:
    - POST /contact-messages/ - إرسال رسالة جديدة (بدون مصادقة)
    - GET /contact-messages/ - عرض الرسائل (للأدمن فقط)
    - PATCH /contact-messages/{id}/mark_as_read/ - تحديد الرسالة كمقروءة
    - PATCH /contact-messages/{id}/mark_as_archived/ - تأرشيف الرسالة
    - GET /contact-messages/unread/ - جلب الرسائل غير المقروءة
    
    البريد الإلكتروني: يتم إرسال بريد تلقائي عند استقبال رسالة
    الأذونات: 
    - POST: AllowAny (لأي شخص)
    - للعمليات الأخرى: IsAdminUser (الأدمن فقط)
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    ordering = ['-created_at']

    def get_permissions(self):
        """تحديد الأذونات حسب الفعل"""
        if self.action == 'create':
            return [AllowAny()]
        else:
            return [IsAdminUser()]
    def get_throttles(self):
        """إضافة throttling للإنشاء فقط"""
        if self.action == 'create':
            return [ContactRateThrottle()]
        return []

    def create(self, request, *args, **kwargs):
        """إنشاء رسالة تواصل جديدة"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        self.send_contact_email(serializer.data)
        
        return Response(
            {
                "message": "تم استقبال رسالتك بنجاح. سنتواصل معك قريباً.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    def send_contact_email(self, data):
        """إرسال بريد إلكتروني عند استقبال رسالة"""
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            
            subject = f"رسالة جديدة من {data['name']}: {data['subject']}"
            message = f"""
رسالة جديدة من صفحة التواصل:

الاسم: {data['name']}
البريد الإلكتروني: {data['email']}
رقم الهاتف: {data.get('phone', 'غير محدد')}
الموضوع: {data['subject']}

الرسالة:
{data['message']}
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],
                fail_silently=True,
            )
        except Exception as e:
            print(f"خطأ في إرسال البريد: {e}")

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """جلب الرسائل غير المقروءة"""
        unread_messages = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread_messages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """تحديد الرسالة كمقروءة"""
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({"message": "تم تحديد الرسالة كمقروءة"})

    @action(detail=True, methods=['post'])
    def mark_as_archived(self, request, pk=None):
        """تأرشيف الرسالة"""
        message = self.get_object()
        message.is_archived = True
        message.save()
        return Response({"message": "تم تأرشيف الرسالة"})
