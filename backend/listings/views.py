from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from django.db import models
from django.db.models import Q
from datetime import timedelta
from .models import Area, Property, PropertyImage, PropertyVideo, Offer, ContactMessage
from .serializers import AreaSerializer, PropertySerializer, OfferSerializer, ContactMessageSerializer
from .notifications import (
    send_property_approved_email,
    send_property_rejected_email,
    send_property_submitted_email,
)

class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'area__name', 'description']
    ordering_fields = ['price', 'created_at', 'size']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        فلترة العقارات بناءً على دور المستخدم:
        - Admin: يرى جميع العقارات
        - Landlord: يرى عقاراته فقط (لإدارتها) + العقارات المُوافق عليها من الآخرين في القائمة
        - زائر: يرى العقارات المُوافق عليها فقط
        
        ملاحظة: get_queryset تُستخدم أيضاً عند الحصول على عقار محدد (get_object)
        لذا نسمح بالوصول إلى عقارات المستخدم الخاصة حتى يتمكن من إدارتها (حذف، تحديث، إلخ)
        """
        try:
            # الحصول على معامل يشير إلى ما إذا كان الطلب للحصول على عقار محدد (detail=True)
            # أم للحصول على قائمة عقارات (detail=False)
            is_detail_request = self.action in ['retrieve', 'destroy', 'update', 'partial_update', 'approve', 'reject', 'resubmit']
            
            if self.request.user.is_staff or self.request.user.is_superuser:
                # الإدمن يرى كل شيء
                queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').all()
            elif self.request.user.is_authenticated:
                # المستخدم المسجل:
                user_profile = self.request.user.profile if hasattr(self.request.user, 'profile') else None
                
                if is_detail_request:
                    # عند الوصول إلى عقار محدد: يمكنه الوصول إلى عقاره الخاص أو العقارات المعتمدة
                    queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(
                        Q(status='approved') | Q(owner=user_profile)
                    )
                else:
                    # في قائمة العقارات: يرى فقط العقارات المعتمدة
                    queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved')
            else:
                # الزائر يرى فقط العقارات المُوافق عليها
                queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved')

            params = self.request.query_params

            # فلتر نوع العقار
            prop_type = params.get('propertyType')
            if prop_type:
                queryset = queryset.filter(type__icontains=prop_type)

            # باقي الفلاتر
            usage_type_mapping = {
                'عائلات': 'families', 'طلاب': 'students', 'استوديو': 'studio',
                'مصيفين': 'vacation', 'حجز يومي': 'daily',
            }
            property_type = params.get('usage_type') or params.get('property_type')
            if property_type and property_type in usage_type_mapping:
                usage_type = usage_type_mapping[property_type]
            elif property_type:
                usage_type = property_type
            else:
                usage_type = None

            rooms = params.get('rooms')
            furnished = params.get('furnished')
            price_min = params.get('price_min')
            price_max = params.get('price_max')
            area_name = params.get('area')

            if usage_type:
                queryset = queryset.filter(usage_type=usage_type)
            if rooms:
                queryset = queryset.filter(rooms=rooms)
            if furnished in ['true', 'false']:
                queryset = queryset.filter(furnished=(furnished == 'true'))
            if price_min:
                queryset = queryset.filter(price__gte=price_min)
            if price_max:
                queryset = queryset.filter(price__lte=price_max)
            if area_name:
                queryset = queryset.filter(area__name=area_name)

            return queryset
        except Exception as e:
            print(f"Error in get_queryset: {e}")
            # في حالة الخطأ، عرض العقارات المُوافق عليها فقط
            return Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved')

    def create(self, request, *args, **kwargs):
        """إنشاء عقار جديد من قبل المالك أو الوسيط أو المكتب"""
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'يجب تسجيل الدخول أولاً'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        if not user_profile or user_profile.user_type not in ['landlord', 'agent', 'office']:
            return Response(
                {'detail': 'فقط مالكي العقارات والوسطاء والمكاتب يمكنهم إضافة عقارات'},
                status=status.HTTP_403_FORBIDDEN
            )

        # طباعة البيانات المُستقبلة للـ debugging
        print(f"\n=== CREATE PROPERTY DEBUG ===")
        print(f"POST Data: {request.data}")
        print(f"Latitude from POST: {request.data.get('latitude')}")
        print(f"Longitude from POST: {request.data.get('longitude')}")
        print(f"=== END DEBUG ===\n")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation Errors: {serializer.errors}")
            return Response(
                {'detail': 'خطأ في البيانات المرسلة', 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # حفظ العقار مع تعيين المالك
        property_obj = serializer.save(owner=user_profile, status='pending', submitted_at=timezone.now())
        
        # معالجة الصور المرسلة
        images = request.FILES.getlist('images')
        for index, image in enumerate(images):
            PropertyImage.objects.create(property=property_obj, image=image, order=index)
        
        # معالجة الفيديوهات المرسلة
        videos = request.FILES.getlist('videos')
        for index, video in enumerate(videos):
            PropertyVideo.objects.create(property=property_obj, video=video, order=index)
        
        # إرسال بريد تأكيد الاستقبال
        send_property_submitted_email(property_obj)
        
        # إعادة الـ serializer لاسترجاع البيانات الكاملة مع الصور
        return Response(
            {
                'detail': 'تم إرسال العقار بنجاح. سيتم مراجعته من قبل فريق الإدارة قريباً.',
                'data': PropertySerializer(property_obj, context={'request': request}).data
            },
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """منع تعديل العقارات - يمكن فقط للإدمن"""
        instance = self.get_object()
        
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'detail': 'لا يمكن تعديل العقارات. يجب حذف العقار وإضافة واحد جديد'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.pop('partial', False))
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """حذف عقار - يمكن للمالك والإدمن فقط"""
        instance = self.get_object()
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        
        # التحقق من الصلاحيات:
        # - الإدمن يمكنه حذف أي عقار
        # - صاحب العقار يمكنه حذف عقاره الخاص فقط
        is_admin = request.user.is_staff or request.user.is_superuser
        is_owner = user_profile and instance.owner == user_profile
        
        if not (is_admin or is_owner):
            return Response(
                {'detail': 'ليس لديك صلاحية حذف هذا العقار'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # حذف العقار
        self.perform_destroy(instance)
        return Response(
            {'detail': 'تم حذف العقار بنجاح'},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_properties(self, request):
        """الحصول على عقارات المستخدم الحالي"""
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        if not user_profile:
            return Response(
                {'detail': 'المستخدم لا يملك ملف شخصي'},
                status=status.HTTP_400_BAD_REQUEST
            )

        properties = Property.objects.filter(owner=user_profile).select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """
        الحصول على العقارات المعلقة مع فلاتر التاريخ
        المعاملات:
        - filter: today, this_week, this_month, all (default: all)
        - search: بحث عن اسم العقار أو المنطقة
        - ordering: created_at, owner (default: -created_at)
        """
        queryset = Property.objects.filter(status='pending').select_related(
            'area', 'owner', 'owner__user', 'approved_by'
        ).prefetch_related('images', 'videos')

        # فلتر التاريخ
        filter_type = request.query_params.get('filter', 'all')
        today = timezone.now().date()
        
        if filter_type == 'today':
            queryset = queryset.filter(
                submitted_at__date=today
            )
        elif filter_type == 'this_week':
            week_start = today - timedelta(days=today.weekday())
            queryset = queryset.filter(
                submitted_at__date__gte=week_start
            )
        elif filter_type == 'this_month':
            month_start = today.replace(day=1)
            queryset = queryset.filter(
                submitted_at__date__gte=month_start
            )
        
        # البحث
        search = request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(area__name__icontains=search) |
                models.Q(owner__user__first_name__icontains=search)
            )
        
        # الترتيب
        ordering = request.query_params.get('ordering', '-submitted_at')
        queryset = queryset.order_by(ordering)
        
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        """الموافقة على عقار (للإدمن فقط)"""
        property_obj = self.get_object()
        
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        notes = request.data.get('approval_notes', '')

        property_obj.status = 'approved'
        property_obj.approved_by = user_profile
        property_obj.approval_notes = notes
        property_obj.save()

        # إرسال بريد الموافقة
        send_property_approved_email(property_obj)

        serializer = self.get_serializer(property_obj)
        return Response({
            'detail': 'تم الموافقة على العقار بنجاح وتم إرسال بريد تأكيد',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """رفض عقار (للإدمن فقط)"""
        property_obj = self.get_object()
        
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        notes = request.data.get('approval_notes', '')

        if not notes:
            return Response(
                {'detail': 'يجب إدخال سبب الرفض'},
                status=status.HTTP_400_BAD_REQUEST
            )

        property_obj.status = 'rejected'
        property_obj.approved_by = user_profile
        property_obj.approval_notes = notes
        property_obj.save()

        # إرسال بريد الرفض
        send_property_rejected_email(property_obj)

        serializer = self.get_serializer(property_obj)
        return Response({
            'detail': 'تم رفض العقار وتم إرسال بريد إخطار',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def rejected(self, request):
        """الحصول على العقارات المرفوضة (للإدمن فقط)"""
        properties = Property.objects.filter(status='rejected').select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def rejected_by_me(self, request):
        """الحصول على العقارات المرفوضة الخاصة بالمستخدم الحالي"""
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        if not user_profile:
            return Response(
                {'detail': 'المستخدم لا يملك ملف شخصي'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        properties = Property.objects.filter(
            owner=user_profile,
            status='rejected'
        ).select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def resubmit(self, request, pk=None):
        """إعادة إرسال عقار مرفوض (للمالك فقط)"""
        property_obj = self.get_object()
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None

        if property_obj.owner != user_profile and not request.user.is_staff:
            return Response(
                {'detail': 'ليس لديك صلاحية تعديل هذا العقار'},
                status=status.HTTP_403_FORBIDDEN
            )

        if property_obj.status != 'rejected':
            return Response(
                {'detail': 'يمكن فقط إعادة إرسال العقارات المرفوضة'},
                status=status.HTTP_400_BAD_REQUEST
            )

        property_obj.status = 'pending'
        property_obj.submitted_at = timezone.now()
        property_obj.approved_by = None
        property_obj.approval_notes = ''
        property_obj.save()

        serializer = self.get_serializer(property_obj)
        return Response({
            'detail': 'تم إعادة إرسال العقار بنجاح',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """إحصائيات العقارات (للإدمن فقط)"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'detail': 'ليس لديك صلاحية الوصول لهذه البيانات'},
                status=status.HTTP_403_FORBIDDEN
            )

        stats = {
            'total': Property.objects.count(),
            'pending': Property.objects.filter(status='pending').count(),
            'approved': Property.objects.filter(status='approved').count(),
            'rejected': Property.objects.filter(status='rejected').count(),
            'draft': Property.objects.filter(status='draft').count(),
        }
        return Response(stats)

class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class OfferViewSet(viewsets.ReadOnlyModelViewSet):
    """عرض العروض الحالية النشطة"""
    serializer_class = OfferSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'discount_percentage']
    ordering = ['-created_at']
    permission_classes = []  # للوصول العام

    def get_queryset(self):
        """جلب العروض النشطة حالياً"""
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
    """ViewSet للتعامل مع رسائل التواصل"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = []  # السماح للجميع بإرسال رسائل
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        """
        إنشاء رسالة تواصل جديدة
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # إرسال بريد إلكتروني (اختياري)
        self.send_contact_email(serializer.data)
        
        return Response(
            {
                "message": "تم استقبال رسالتك بنجاح. سنتواصل معك قريباً.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    def send_contact_email(self, data):
        """إرسال بريد إلكتروني عند استقبال رسالة تواصل"""
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            
            subject = f"رسالة جديدة من {data['name']}: {data['subject']}"
            message = f"""
رسالة جديدة من صفحة التواصل:

الاسم: {data['name']}
البريد الإلكتروني: {data['email']}
رقم الهاتف: {data['phone']}
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

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def unread(self, request):
        """جلب الرسائل غير المقروءة (للإدمن فقط)"""
        unread_messages = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread_messages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_as_read(self, request, pk=None):
        """تحديد الرسالة كمقروءة (للإدمن فقط)"""
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({"message": "تم تحديد الرسالة كمقروءة"})
