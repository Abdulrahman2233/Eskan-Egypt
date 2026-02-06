from django.contrib import admin
from django.utils.html import format_html
from .models import Area, Property, PropertyImage, PropertyVideo, Offer, ContactMessage, ActivityLog, Transaction, PropertyAuditTrail


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    readonly_fields = ('order',)


class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1
    readonly_fields = ('order',)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'get_owner_info',
        'area',
        'price',
        'discount',
        'rooms',
        'beds',
        'status_badge',
        'featured',
        'created_at',
    )
    search_fields = ('name', 'address', 'owner__user__username', 'owner__user__email')
    list_filter = (
        'status',
        'featured',
        'furnished',
        'created_at',
        'owner__user_type',
        'is_deleted',  # إضافة فلتر للعقارات المحذوفة
    )
    # inlines = [PropertyImageInline, PropertyVideoInline]  # مخفية من admin
    inlines = [PropertyImageInline, PropertyVideoInline]
    readonly_fields = (
        'id',
        'created_at',
        'updated_at',
        'submitted_at',
        'status_badge',
        'get_owner_preview'
    )

    fieldsets = (
        ('معلومات العقار الأساسية', {
            'fields': (
                'id', 'name', 'area', 'address',
                'price', 'original_price', 'discount', 'rooms', 'beds', 'bathrooms', 'size', 'floor',
                'furnished', 'usage_type'
            )
        }),
        ('الموقع الجغرافي', {
            'fields': (
                'latitude', 'longitude'
            )
        }),
        ('الوصف والتفاصيل', {
            'fields': (
                'description', 'contact', 'featured'
            )
        }),
        ('معلومات المالك والموافقة', {
            'fields': (
                'get_owner_preview', 'owner', 'status', 'status_badge', 'submitted_at',
                'approved_by', 'approval_notes'
            )
        }),
        ('معلومات النظام', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """إخفاء العقارات المحذوفة من القائمة الافتراضية"""
        qs = super().get_queryset(request)
        # إذا لم يكن هناك فلتر "is_deleted"، اخف المحذوفة افتراضياً
        if 'is_deleted__exact' not in request.GET:
            qs = qs.filter(is_deleted=False)
        return qs

    def get_owner_info(self, obj):
        """عرض معلومات المالك في قائمة العقارات"""
        if not obj.owner:
            return format_html('<span style="color: #e74c3c;">بدون مالك</span>')
        
        user_type_colors = {
            'landlord': '#2ecc71',
            'agent': '#f39c12',
            'office': '#9b59b6',
        }
        user_type_display = {
            'landlord': 'مالك',
            'agent': 'وسيط',
            'office': 'مكتب',
        }
        
        color = user_type_colors.get(obj.owner.user_type, '#95a5a6')
        user_type_text = user_type_display.get(obj.owner.user_type, obj.owner.user_type)
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">{}</span><br/><span style="font-size: 12px; color: #7f8c8d;">{}</span>',
            color,
            user_type_text,
            obj.owner.user.username
        )
    get_owner_info.short_description = "مالك العقار"

    def get_owner_preview(self, obj):
        """عرض معاينة كاملة لمعلومات المالك"""
        if not obj.owner:
            return format_html('<span style="color: #e74c3c;">لم يتم تحديد مالك</span>')
        
        owner = obj.owner
        user_type_display = {
            'tenant': 'مستأجر',
            'landlord': 'مالك عقار',
            'agent': 'وسيط',
            'office': 'مكتب',
            'admin': 'مسؤول',
        }
        user_type_text = user_type_display.get(owner.user_type, owner.user_type)
        
        html = '<div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px;">'
        html += f'<p><strong>الاسم الكامل:</strong> {owner.user.get_full_name() or "بدون اسم"}</p>'
        html += f'<p><strong>اسم المستخدم:</strong> {owner.user.username}</p>'
        html += f'<p><strong>البريد الإلكتروني:</strong> {owner.user.email}</p>'
        html += f'<p><strong>نوع الحساب:</strong> {user_type_text}</p>'
        html += f'<p><strong>رقم الهاتف:</strong> {owner.phone_number or "بدون"}</p>'
        html += f'<p><strong>المدينة:</strong> {owner.city or "بدون"}</p>'
        html += f'<p><strong>السيرة الذاتية:</strong> {owner.bio or "بدون"}</p>'
        html += f'<p><strong>تاريخ الانضمام:</strong> {owner.created_at.strftime("%Y-%m-%d %H:%M")}</p>'
        html += '</div>'
        
        return format_html(html)
    get_owner_preview.short_description = "معاينة معلومات المالك"

    def status_badge(self, obj):
        """عرض حالة العقار في شكل بطاقة ملونة"""
        colors = {
            'draft': '#888888',
            'pending': '#FFA500',
            'approved': '#28a745',
            'rejected': '#dc3545',
        }
        status_display = {
            'draft': 'مسودة',
            'pending': 'قيد المراجعة',
            'approved': 'موافق عليه',
            'rejected': 'مرفوض',
        }
        color = colors.get(obj.status, '#888888')
        status_text = status_display.get(obj.status, obj.status)
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            status_text
        )
    status_badge.short_description = "حالة العقار"

    def delete_model(self, request, obj):
        """
        تجاوز الحذف الفعلي (hard delete) واستخدام soft delete بدلاً منه
        مع تسجيل العملية في PropertyAuditTrail
        """
        from django.utils import timezone
        from .models import PropertyAuditTrail
        from .serializers import PropertySerializer
        
        # حفظ البيانات قبل الحذف
        serializer = PropertySerializer(obj, context={'request': request})
        property_data_before = serializer.data
        
        # تنفيذ soft delete
        obj.is_deleted = True
        obj.deleted_at = timezone.now()
        obj.deleted_by = request.user.profile if hasattr(request.user, 'profile') else None
        obj.save()
        
        # تسجيل العملية في PropertyAuditTrail
        try:
            PropertyAuditTrail.objects.create(
                property=obj,
                action='delete',
                performed_by=request.user.profile if hasattr(request.user, 'profile') else None,
                property_data_before=property_data_before,
                property_data_after={},  # لا توجد بيانات بعد الحذف
                notes=f"تم الحذف من Django Admin بواسطة {request.user.username}",
                ip_address=self._get_client_ip(request)
            )
        except Exception as e:
            print(f"خطأ في تسجيل حذف العقار: {str(e)}")
    
    def _get_client_ip(self, request):
        """الحصول على عنوان IP الفعلي"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_actions(self, request):
        """تعطيل delete_selected action لمنع الحذف المجمع"""
        actions = super().get_actions(request)
        # تعطيل الحذف المجمع (bulk delete)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'property_count')
    search_fields = ('name',)

    def property_count(self, obj):
        return obj.properties.count()
    property_count.short_description = "عدد العقارات"


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'discount_percentage',
        'target_audience',
        'status_badge',
        'start_date',
        'end_date',
        'created_at',
    )
    search_fields = ('title', 'description')
    list_filter = (
        'is_active',
        'target_audience',
        'icon_type',
        'created_at',
        'start_date',
        'end_date',
    )
    readonly_fields = ('created_at', 'updated_at', 'status_badge')
    
    fieldsets = (
        ('معلومات العرض', {
            'fields': ('title', 'description', 'discount_percentage', 'terms')
        }),
        ('الجمهور المستهدف', {
            'fields': ('target_audience', 'icon_type')
        }),
        ('التواريخ والحالة', {
            'fields': ('start_date', 'end_date', 'is_active', 'status_badge')
        }),
        ('المعلومات الإضافية', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """عرض حالة العرض"""
        from django.utils import timezone
        now = timezone.now()
        
        # فحص إذا كانت البداية موجودة
        if not obj.start_date:
            return format_html(
                '<span style="background-color: #ffc107; color: black; padding: 5px 10px; border-radius: 3px; font-weight: bold;">غير محدد</span>'
            )
        
        if not obj.is_active:
            return format_html(
                '<span style="background-color: #999; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">معطل</span>'
            )
        elif obj.start_date > now:
            return format_html(
                '<span style="background-color: #ffc107; color: black; padding: 5px 10px; border-radius: 3px; font-weight: bold;">قريباً</span>'
            )
        elif obj.end_date and obj.end_date < now:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">انتهى</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">نشط</span>'
            )
    
    status_badge.short_description = "الحالة"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'subject',
        'created_at',
    )
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('معلومات المرسل', {
            'fields': ('name', 'email')
        }),
        ('الرسالة', {
            'fields': ('subject', 'message')
        }),
        ('التواريخ', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = (
        'get_action_badge',
        'user_display',
        'content_type',
        'object_name',
        'timestamp_display',
    )
    list_filter = (
        'action',
        'content_type',
        'timestamp',
        'user',
    )
    search_fields = (
        'user__user__username',
        'user__user__email',
        'object_name',
        'object_id',
        'description',
    )
    readonly_fields = (
        'user',
        'action',
        'content_type',
        'object_id',
        'object_name',
        'description',
        'ip_address',
        'timestamp',
    )
    fieldsets = (
        ('معلومات النشاط', {
            'fields': ('user', 'action', 'timestamp')
        }),
        ('تفاصيل الكائن', {
            'fields': ('content_type', 'object_id', 'object_name')
        }),
        ('معلومات إضافية', {
            'fields': ('description', 'ip_address'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-timestamp',)
    can_delete = False
    actions = None
    
    def get_action_badge(self, obj):
        """عرض نوع النشاط في شكل بطاقة ملونة"""
        action_colors = {
            'create_property': '#2ecc71',
            'delete_property': '#e74c3c',
            'update_property': '#3498db',
            'create_user': '#9b59b6',
            'approve_property': '#27ae60',
            'reject_property': '#c0392b',
        }
        color = action_colors.get(obj.action, '#95a5a6')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_action_display()
        )
    get_action_badge.short_description = 'نوع النشاط'
    
    def user_display(self, obj):
        """عرض معلومات المستخدم"""
        if obj.user:
            return format_html(
                '<strong>{}</strong><br/><span style="font-size: 12px; color: #7f8c8d;">{}</span>',
                obj.user.user.username,
                obj.user.user.email
            )
        return format_html('<span style="color: #e74c3c;">حسابات محذوفة</span>')
    user_display.short_description = 'المستخدم'
    
    def timestamp_display(self, obj):
        """عرض التاريخ والوقت بشكل محسّن"""
        from django.utils.timezone import localtime
        local_time = localtime(obj.timestamp)
        return local_time.strftime('%Y-%m-%d<br/>%H:%M:%S')
    timestamp_display.short_description = 'التاريخ والوقت'
    
    def has_add_permission(self, request):
        """منع إضافة سجلات نشاط يدويًا"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """منع حذف سجلات النشاط"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """منع تعديل سجلات النشاط"""
        return False

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'property_name',
        'region',
        'account_type',
        'property_type',
        'rent_price',
        'profit',
        'created_at',
        'get_user_info',
    )
    search_fields = ('property_name', 'region', 'user__user__username')
    list_filter = (
        'account_type',
        'property_type',
        'region',
        'created_at',
    )
    readonly_fields = ('id', 'created_at', 'updated_at')
    fields = (
        'id',
        'user',
        'property_name',
        'region',
        'account_type',
        'property_type',
        'rent_price',
        'commission',
        'profit',
        'created_at',
        'updated_at',
    )
    
    def get_user_info(self, obj):
        """عرض معلومات المستخدم"""
        if obj.user and obj.user.user:
            return f"{obj.user.user.get_full_name() or obj.user.user.username}"
        return "-"
    get_user_info.short_description = "المستخدم"


@admin.register(PropertyAuditTrail)
class PropertyAuditTrailAdmin(admin.ModelAdmin):
    list_display = (
        'get_action_badge',
        'property_display',
        'performed_by_display',
        'timestamp_formatted',
    )
    search_fields = (
        'property__name',
        'property__address',
        'performed_by__user__username',
        'performed_by__user__email',
        'notes',
    )
    list_filter = (
        'action',
        'timestamp',
        'performed_by',
    )
    readonly_fields = (
        'property',
        'action',
        'performed_by',
        'property_data_before',
        'property_data_after',
        'ip_address',
        'timestamp',
    )
    fieldsets = (
        ('معلومات العملية', {
            'fields': ('action', 'property', 'performed_by', 'timestamp', 'ip_address')
        }),
        ('البيانات', {
            'fields': ('property_data_before', 'property_data_after'),
            'classes': ('collapse',)
        }),
        ('الملاحظات', {
            'fields': ('notes',),
        }),
    )
    ordering = ('-timestamp',)
    can_delete = False
    actions = None
    
    def get_action_badge(self, obj):
        """عرض نوع العملية في شكل بطاقة ملونة"""
        action_colors = {
            'create': '#2ecc71',
            'delete': '#e74c3c',
            'restore': '#3498db',
            'approve': '#27ae60',
            'reject': '#c0392b',
        }
        color = action_colors.get(obj.action, '#95a5a6')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_action_display()
        )
    get_action_badge.short_description = 'نوع العملية'
    
    def property_display(self, obj):
        """عرض معلومات العقار"""
        return format_html(
            '<strong>{}</strong><br/><span style="font-size: 12px; color: #7f8c8d;">{}</span>',
            obj.property.name,
            obj.property.address
        )
    property_display.short_description = 'العقار'
    
    def performed_by_display(self, obj):
        """عرض معلومات من قام بالعملية"""
        if obj.performed_by and obj.performed_by.user:
            return format_html(
                '<strong>{}</strong><br/><span style="font-size: 12px; color: #7f8c8d;">{}</span>',
                obj.performed_by.user.get_full_name() or obj.performed_by.user.username,
                obj.performed_by.user.email
            )
        return format_html('<span style="color: #e74c3c;">حساب محذوف</span>')
    performed_by_display.short_description = 'تم بواسطة'
    
    def timestamp_formatted(self, obj):
        """عرض التاريخ والوقت بشكل محسّن"""
        from django.utils.timezone import localtime
        local_time = localtime(obj.timestamp)
        return local_time.strftime('%Y-%m-%d<br/>%H:%M:%S')
    timestamp_formatted.short_description = 'التاريخ والوقت'
    
    def has_add_permission(self, request):
        """منع إضافة سجلات يدويًا"""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """منع حذف السجلات"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """منع تعديل السجلات"""
        return False