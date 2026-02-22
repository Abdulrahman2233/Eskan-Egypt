from django.contrib import admin
from .models import UserEarning


@admin.register(UserEarning)
class UserEarningAdmin(admin.ModelAdmin):
    """
    إدارة أرباح المستخدمين من لوحة التحكم
    """
    list_display = ['property_name', 'user', 'area', 'property_type', 'earnings', 'deal_date']
    list_filter = ['property_type', 'area', 'deal_date', 'user']
    search_fields = ['property_name', 'area', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-deal_date']
    
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('user', 'property_name', 'area', 'property_type')
        }),
        ('تفاصيل الصفقة', {
            'fields': ('earnings', 'deal_date', 'notes')
        }),
        ('معلومات النظام', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """
        السماح للمسؤولين بمشاهدة جميع الأرباح
        بينما يمكن للمستخدمين مشاهدة أرباحهم فقط
        """
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(user=request.user)
        return qs
