# users/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import UserProfile


class PropertyInline(admin.TabularInline):
    """Inline display for user's properties"""
    from listings.models import Property
    model = Property
    fk_name = 'owner'
    extra = 0
    readonly_fields = ('id', 'name', 'area', 'price', 'status', 'created_at')
    fields = ('name', 'area', 'price', 'rooms', 'beds', 'bathrooms', 'status', 'created_at')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "get_full_name",
        "get_username",
        "get_email",
        "user_type_badge",
        "phone_number",
        "get_properties_count",
        "created_at"
    )
    list_filter = ("created_at", "user_type", "is_email_verified", "is_phone_verified")
    search_fields = ("user__username", "user__email", "phone_number")
    readonly_fields = ("created_at", "updated_at", "last_login_at", "get_properties_preview")

    fieldsets = (
        ("معلومات الحساب", {
            "fields": ("user", "user_type", "is_phone_verified", "last_login_at")
        }),
        ("المعلومات الشخصية", {
            "fields": ("full_name", "email", "phone_number", "date_of_birth", "city")
        }),
        ("معلومات النظام", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
        ("العقارات المضافة", {
            "fields": ("get_properties_preview",),
            "classes": ("collapse",),
            "description": "عرض جميع العقارات التي أضافها المستخدم"
        }),
    )

    inlines = [PropertyInline]

    def get_full_name(self, obj):
        """عرض الاسم الكامل للمستخدم"""
        return obj.user.get_full_name() or "بدون اسم"
    get_full_name.short_description = "الاسم الكامل"

    def get_username(self, obj):
        """عرض اسم المستخدم"""
        return obj.user.username
    get_username.short_description = "اسم المستخدم"

    def get_email(self, obj):
        """عرض البريد الإلكتروني"""
        return obj.user.email
    get_email.short_description = "البريد الإلكتروني"

    def user_type_badge(self, obj):
        """عرض نوع المستخدم في شكل بطاقة ملونة"""
        colors = {
            'tenant': '#3498db',      # أزرق - المستأجر
            'landlord': '#2ecc71',    # أخضر - مالك العقار
            'agent': '#f39c12',       # برتقالي - الوسيط
            'office': '#9b59b6',      # بنفسجي - المكتب
            'admin': '#e74c3c',       # أحمر - المسؤول
        }
        user_type_display = {
            'tenant': 'مستأجر',
            'landlord': 'مالك عقار',
            'agent': 'وسيط',
            'office': 'مكتب',
            'admin': 'مسؤول',
        }
        color = colors.get(obj.user_type, '#95a5a6')
        display = user_type_display.get(obj.user_type, obj.get_user_type_display())
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            display
        )
    user_type_badge.short_description = "نوع الحساب"

    def get_properties_count(self, obj):
        """عرض عدد العقارات"""
        count = obj.properties.count()
        return format_html(
            '<span style="background-color: #3498db; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">{}</span>',
            count
        )
    get_properties_count.short_description = "عدد العقارات"

    def get_properties_preview(self, obj):
        """عرض معاينة العقارات المضافة"""
        properties = obj.properties.all()[:10]  # عرض أول 10 عقارات
        if not properties:
            return "لم يضف هذا المستخدم أي عقارات"
        
        html = '<table style="width: 100%; border-collapse: collapse;">'
        html += '<tr style="background-color: #ecf0f1;"><th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">اسم العقار</th><th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">المنطقة</th><th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">السعر</th><th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">الحالة</th><th style="padding: 8px; border: 1px solid #bdc3c7; text-align: right;">التاريخ</th></tr>'
        
        status_colors = {
            'draft': '#95a5a6',
            'pending': '#f39c12',
            'approved': '#2ecc71',
            'rejected': '#e74c3c',
        }
        status_display = {
            'draft': 'مسودة',
            'pending': 'قيد المراجعة',
            'approved': 'موافق عليه',
            'rejected': 'مرفوض',
        }
        
        for prop in properties:
            status_color = status_colors.get(prop.status, '#95a5a6')
            status_text = status_display.get(prop.status, prop.status)
            html += f'<tr style="border-bottom: 1px solid #bdc3c7;"><td style="padding: 8px; text-align: right;">{prop.name}</td><td style="padding: 8px; text-align: right;">{prop.area.name if prop.area else "بدون"}</td><td style="padding: 8px; text-align: right;">{prop.price:,.0f} ج.م</td><td style="padding: 8px; text-align: right;"><span style="background-color: {status_color}; color: white; padding: 3px 8px; border-radius: 3px;">{status_text}</span></td><td style="padding: 8px; text-align: right;">{prop.created_at.strftime("%Y-%m-%d")}</td></tr>'
        
        html += '</table>'
        
        if obj.properties.count() > 10:
            html += f'<p style="margin-top: 10px; color: #e74c3c;"><strong>وأكثر من {obj.properties.count() - 10} عقارات أخرى...</strong></p>'
        
        return format_html(html)
    get_properties_preview.short_description = "معاينة العقارات"

    def has_add_permission(self, request):
        return False  # منع إضافة مستخدمين جدد من هنا

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # فقط المسؤول الأعلى يمكنه الحذف

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
