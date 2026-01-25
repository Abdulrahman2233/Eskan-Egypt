from django.contrib import admin
from django.utils.html import format_html
from .models import Area, Property, PropertyImage, PropertyVideo, Offer, ContactMessage


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
