from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class UserEarning(models.Model):
    """
    نموذج أرباح المستخدم
    يتتبع جميع الصفقات والأرباح لكل مستخدم
    """
    
    PROPERTY_TYPES = [
        ('students', 'طلاب'),
        ('families', 'عائلات'),
        ('vacationers', 'مصيفين'),
        ('studio', 'استديو'),
        ('daily', 'حجز يومي'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='earnings')
    property_name = models.CharField(
        max_length=255,
        verbose_name='اسم العقار',
        help_text='اسم العقار الذي تم منه الربح'
    )
    area = models.CharField(
        max_length=255,
        verbose_name='المنطقة',
        help_text='منطقة العقار'
    )
    property_type = models.CharField(
        max_length=50,
        choices=PROPERTY_TYPES,
        default='families',
        verbose_name='نوع العقار'
    )
    earnings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='الأرباح',
        help_text='قيمة الربح بالجنيه المصري'
    )
    deal_date = models.DateField(
        verbose_name='تاريخ الصفقة',
        help_text='التاريخ الذي تمت فيه الصفقة'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name='ملاحظات',
        help_text='ملاحظات إضافية عن الصفقة'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='تاريخ الإنشاء'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='تاريخ التحديث'
    )
    
    class Meta:
        ordering = ['-deal_date', '-created_at']
        indexes = [
            models.Index(fields=['-deal_date']),
            models.Index(fields=['user', '-deal_date']),
        ]
        verbose_name = 'أرباح المستخدم'
        verbose_name_plural = 'أرباح المستخدمين'
    
    def __str__(self):
        return f"{self.user.username} - {self.property_name} - {self.earnings} ج.م"
