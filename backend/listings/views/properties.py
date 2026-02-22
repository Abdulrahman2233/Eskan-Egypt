"""
Property ViewSet - جميع عمليات إدارة العقارات
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta

from ..models import Property, PropertyImage, PropertyVideo, ActivityLog, PropertyAuditTrail
from ..serializers import PropertySerializer, PropertyAuditTrailSerializer
from ..notifications import (
    send_property_approved_email,
    send_property_rejected_email,
    send_property_submitted_email,
)
from .utils import get_client_ip


class PropertyViewSet(viewsets.ModelViewSet):
    """
    ViewSet شامل لإدارة العقارات
    
    العمليات المدعومة:
    - GET /properties/ - قائمة العقارات (المعتمدة فقط للعموم)
    - POST /properties/ - إضافة عقار جديد (للمستخدمين المسجلين)
    - GET /properties/{id}/ - عرض تفاصيل العقار
    - PUT/PATCH /properties/{id}/ - تعديل العقار (ليس المالك)
    - DELETE /properties/{id}/ - حذف العقار (المالك أو الأدمن)
    
    الأدوار الخاصة:
    - POST /properties/{id}/approve/ - موافقة على عقار (الأدمن)
    - POST /properties/{id}/reject/ - رفض عقار (الأدمن)
    - POST /properties/{id}/resubmit/ - إعادة إرسال عقار مرفوض (المالك)
    - POST /properties/{id}/record_view/ - تسجيل مشاهدة
    - GET /properties/pending/ - العقارات المعلقة (الأدمن)
    - GET /properties/by-me/ - عقاراتي (المستخدم)
    
    فلترة البحث:
    - search: اسم، عنوان، منطقة، وصف
    - usage_type: نوع الاستخدام (طلاب، عائلات، إلخ)
    - rooms, price_min, price_max: الخصائص المختلفة
    - area: المنطقة
    
    Permissions: IsAuthenticated للإضافة، AllowAny للاستعراض
    """
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'area__name', 'description']
    ordering_fields = ['price', 'created_at', 'size']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        فلترة العقارات بناءً على دور المستخدم والـ Action:
        - الصفحة الرئيسية (list): الجميع يرى العقارات المعتمدة فقط
        - صفحة الأدمن (admin actions): الأدمن يرى جميع العقارات
        - التفاصيل (retrieve): الأدمن يرى كل شيء، الآخرون يرون عقارهم أو المعتمدة
        """
        try:
            is_admin = self.request.user.is_staff or self.request.user.is_superuser
            is_list_view = self.action == 'list'
            is_detail_request = self.action in ['retrieve', 'update', 'partial_update', 'approve', 'reject', 'resubmit']
            
            # الصفحة الرئيسية: الجميع (حتى الأدمن) يرى العقارات المعتمدة فقط
            if is_list_view:
                queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved', is_deleted=False)
            # صفحة الأدمن والـ Admin Actions: الأدمن يرى جميع العقارات
            elif is_admin:
                queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(is_deleted=False)
            elif self.request.user.is_authenticated:
                # المستخدم المسجل:
                user_profile = self.request.user.profile if hasattr(self.request.user, 'profile') else None
                
                if is_detail_request:
                    # عند الوصول إلى عقار محدد: يمكنه الوصول إلى عقاره الخاص أو العقارات المعتمدة (للقراءة)
                    if user_profile:
                        queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(
                            (Q(owner=user_profile) | Q(status='approved')) & Q(is_deleted=False)
                        )
                    else:
                        queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved', is_deleted=False)
                elif self.action == 'destroy':
                    # للحذف: يمكن للمالك حذف عقاره (بدون تصفية بناءً على الحالة)
                    if user_profile:
                        queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(
                            owner=user_profile, is_deleted=False
                        )
                    else:
                        queryset = Property.objects.none()
                else:
                    # في قائمة العقارات: المستخدم يرى فقط العقارات المعتمدة (غير المحذوفة)
                    queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved', is_deleted=False)
            else:
                # الزائر يرى فقط العقارات المُوافق عليها (غير المحذوفة)
                queryset = Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved', is_deleted=False)

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
            # في حالة الخطأ، عرض العقارات المُوافق عليها فقط (غير المحذوفة)
            return Property.objects.select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos').filter(status='approved', is_deleted=False)

    def retrieve(self, request, *args, **kwargs):
        """الحصول على تفاصيل العقار وتسجيل المشاهدة"""
        instance = self.get_object()
        
        # تسجيل مشاهدة جديدة
        client_ip = get_client_ip(request)
        instance.record_view(client_ip)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
        
        # جميع العقارات الجديدة تبدأ في انتظار المراجعة (pending)
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
        """تعديل كامل العقار (محدود - الإدمن فقط)"""
        is_admin = request.user.is_staff or request.user.is_superuser
        if not is_admin:
            return Response(
                {'detail': 'فقط الإدارة يمكنها تعديل العقارات'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        
        # السماح فقط بتعديل حقول معينة (رقم الاتصال مثلا)
        allowed_fields = ['contact', 'name', 'address']
        for field in allowed_fields:
            if field in request.data:
                setattr(instance, field, request.data[field])
        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """التعديل الجزئي للعقار (محدود - الإدمن فقط)"""
        is_admin = request.user.is_staff or request.user.is_superuser
        if not is_admin:
            return Response(
                {'detail': 'فقط الإدارة يمكنها تعديل العقارات'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance = self.get_object()
        
        # السماح فقط بتعديل حقول معينة
        allowed_fields = ['contact', 'name', 'address']
        for field in allowed_fields:
            if field in request.data:
                setattr(instance, field, request.data[field])
        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """حذف عقار (حذف منطقي) - يمكن للمالك والإدمن فقط"""
        instance = self.get_object()
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        
        # التحقق من الصلاحيات
        is_admin = request.user.is_staff or request.user.is_superuser
        is_owner = user_profile and instance.owner == user_profile
        
        if not (is_admin or is_owner):
            return Response(
                {'detail': 'ليس لديك صلاحية حذف هذا العقار'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # حفظ بيانات العقار قبل الحذف (Audit Trail)
        property_data = PropertySerializer(instance, context={'request': request}).data
        
        # حذف منطقي
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.deleted_by = user_profile
        instance.save()
        
        # تسجيل في Audit Trail
        PropertyAuditTrail.objects.create(
            property=instance,
            action='delete',
            performed_by=user_profile,
            property_data_before=property_data,
            property_data_after={},
            notes=request.data.get('notes', ''),
            ip_address=get_client_ip(request)
        )
        
        # تسجيل في ActivityLog
        ActivityLog.objects.create(
            user=user_profile,
            action='delete_property',
            content_type='property',
            object_id=str(instance.id),
            object_name=instance.name,
            description=f"تم حذف العقار: {instance.name}",
            ip_address=get_client_ip(request)
        )
        
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

        properties = Property.objects.filter(owner=user_profile, is_deleted=False).select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """الحصول على العقارات المعلقة مع فلاتر التاريخ"""
        queryset = Property.objects.filter(status='pending', is_deleted=False).select_related(
            'area', 'owner', 'owner__user', 'approved_by'
        ).prefetch_related('images', 'videos')

        # فلتر التاريخ
        filter_type = request.query_params.get('filter', 'all')
        today = timezone.now().date()
        
        if filter_type == 'today':
            queryset = queryset.filter(submitted_at__date=today)
        elif filter_type == 'this_week':
            week_start = today - timedelta(days=today.weekday())
            queryset = queryset.filter(submitted_at__date__gte=week_start)
        elif filter_type == 'this_month':
            month_start = today.replace(day=1)
            queryset = queryset.filter(submitted_at__date__gte=month_start)
        
        # البحث
        search = request.query_params.get('search', '').strip()
        if search:
            from django.db import models
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
        """الموافقة على عقار"""
        from django.utils import timezone
        
        property_obj = self.get_object()
        
        if property_obj.is_deleted:
            return Response(
                {'detail': 'لا يمكن الموافقة على عقار محذوف'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        notes = request.data.get('approval_notes', '')

        property_obj.status = 'approved'
        property_obj.approved_by = user_profile
        property_obj.approved_at = timezone.now()
        property_obj.approval_notes = notes
        property_obj.save()

        send_property_approved_email(property_obj)

        serializer = self.get_serializer(property_obj)
        return Response({
            'detail': 'تم الموافقة على العقار بنجاح وتم إرسال بريد تأكيد',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """رفض عقار"""
        from django.utils import timezone
        
        property_obj = self.get_object()
        
        if property_obj.is_deleted:
            return Response(
                {'detail': 'لا يمكن رفض عقار محذوف'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        notes = request.data.get('approval_notes', '')

        if not notes:
            return Response(
                {'detail': 'يجب إدخال سبب الرفض'},
                status=status.HTTP_400_BAD_REQUEST
            )

        property_obj.status = 'rejected'
        property_obj.approved_by = user_profile
        property_obj.rejected_at = timezone.now()
        property_obj.approval_notes = notes
        property_obj.save()

        send_property_rejected_email(property_obj)

        serializer = self.get_serializer(property_obj)
        return Response({
            'detail': 'تم رفض العقار وتم إرسال بريد إخطار',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def rejected(self, request):
        """الحصول على العقارات المرفوضة"""
        properties = Property.objects.filter(status='rejected', is_deleted=False).select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def deleted(self, request):
        """الحصول على العقارات المحذوفة"""
        properties = Property.objects.filter(is_deleted=True).select_related('area', 'owner', 'approved_by', 'deleted_by').prefetch_related('images', 'videos').order_by('-deleted_at')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def audit_trail(self, request):
        """الحصول على سجل تدقيق العقارات"""
        queryset = PropertyAuditTrail.objects.select_related('property', 'performed_by').order_by('-timestamp')
        
        # فلاتر
        property_id = request.query_params.get('property_id')
        action = request.query_params.get('action')
        user_id = request.query_params.get('user_id')
        
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        if action:
            queryset = queryset.filter(action=action)
        if user_id:
            queryset = queryset.filter(performed_by_id=user_id)
        
        serializer = PropertyAuditTrailSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def rejected_by_me(self, request):
        """الحصول على العقارات المرفوضة للمستخدم الحالي"""
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None
        if not user_profile:
            return Response(
                {'detail': 'المستخدم لا يملك ملف شخصي'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        properties = Property.objects.filter(
            owner=user_profile,
            status='rejected',
            is_deleted=False
        ).select_related('area', 'owner', 'approved_by').prefetch_related('images', 'videos')
        serializer = self.get_serializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def resubmit(self, request, pk=None):
        """إعادة إرسال عقار مرفوض"""
        property_obj = self.get_object()
        user_profile = request.user.profile if hasattr(request.user, 'profile') else None

        if property_obj.owner != user_profile and not request.user.is_staff:
            return Response(
                {'detail': 'ليس لديك صلاحية تعديل هذا العقار'},
                status=status.HTTP_403_FORBIDDEN
            )

        if property_obj.is_deleted:
            return Response(
                {'detail': 'لا يمكن إعادة إرسال عقار محذوف'},
                status=status.HTTP_400_BAD_REQUEST
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
        """الحصول على العقارات المميزة"""
        qs = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """إحصائيات العقارات"""
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'detail': 'ليس لديك صلاحية الوصول لهذه البيانات'},
                status=status.HTTP_403_FORBIDDEN
            )

        stats = {
            'total': Property.objects.filter(is_deleted=False).count(),
            'pending': Property.objects.filter(status='pending', is_deleted=False).count(),
            'approved': Property.objects.filter(status='approved', is_deleted=False).count(),
            'rejected': Property.objects.filter(status='rejected', is_deleted=False).count(),
            'draft': Property.objects.filter(status='draft', is_deleted=False).count(),
        }
        return Response(stats)
