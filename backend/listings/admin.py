from django.contrib import admin
from django.utils.html import format_html
from .models import Area, Property, PropertyImage, PropertyVideo


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
        'area',
        'price',
        'rooms',
        'status_badge',
        'featured',
    )
    search_fields = ('name', 'address', 'owner__user__username')
    list_filter = (
        'status',
        'type',
        'featured',
        'furnished',
        'created_at',
    )
    inlines = [PropertyImageInline, PropertyVideoInline]
    readonly_fields = (
        'id',
        'created_at',
        'updated_at',
        'submitted_at',
        'status_badge'
    )

    fieldsets = (
        ('معلومات العقار الأساسية', {
            'fields': (
                'id', 'name', 'name_en', 'area', 'address',
                'price', 'rooms', 'bathrooms', 'size', 'floor',
                'furnished', 'type', 'type_en', 'usage_type'
            )
        }),
        ('الوصف والتفاصيل', {
            'fields': (
                'description', 'description_en', 'contact', 'featured'
            )
        }),
        ('معلومات المالك والموافقة', {
            'fields': (
                'owner', 'status', 'status_badge', 'submitted_at',
                'approved_by', 'approval_notes'
            )
        }),
        ('معلومات النظام', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        """عرض حالة العقار في شكل بطاقة ملونة"""
        colors = {
            'draft': '#888888',
            'pending': '#FFA500',
            'approved': '#28a745',
            'rejected': '#dc3545',
        }
        color = colors.get(obj.status, '#888888')
        status_text = dict(obj._meta.get_field('status').choices).get(obj.status, obj.status)
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            status_text
        )
    status_badge.short_description = "حالة العقار"


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_en', 'property_count')
    search_fields = ('name',)

    def property_count(self, obj):
        return obj.properties.count()
    property_count.short_description = "عدد العقارات"


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'order', 'image_preview')
    list_filter = ('property', 'order')
    search_fields = ('property__name',)
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="100" height="100" style="border-radius: 5px;" />',
                obj.image.url
            )
        return "لا توجد صورة"
    image_preview.short_description = "معاينة"


@admin.register(PropertyVideo)
class PropertyVideoAdmin(admin.ModelAdmin):
    list_display = ('property', 'order', 'video_info')
    list_filter = ('property', 'order')
    search_fields = ('property__name',)

    def video_info(self, obj):
        if obj.video:
            return format_html(
                '<a href="{}" target="_blank">🎥 مشاهدة الفيديو</a>',
                obj.video.url
            )
        return "لا يوجد فيديو"
    video_info.short_description = "الفيديو"
