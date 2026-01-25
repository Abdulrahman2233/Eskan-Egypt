import uuid
from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator, MinValueValidator, MaxValueValidator


def generate_uuid():
    return uuid.uuid4()


class Area(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Property(models.Model):
    STATUS_CHOICES = [
        ('draft', 'مسودة'),
        ('pending', 'معلق'),
        ('approved', 'موافق عليه'),
        ('rejected', 'مرفوض'),
    ]

    USAGE_TYPES = [
        ('students', 'طلاب'),
        ('families', 'عائلات'),
        ('studio', 'استوديو'),
        ('vacation', 'مصيفين'),
        ('daily', 'حجز يومي'),
    ]

    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    name = models.CharField(max_length=200)
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='properties')
    address = models.CharField(max_length=300)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    original_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name='السعر الأصلي')
    discount = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)], verbose_name='نسبة الخصم (%)')
    rooms = models.IntegerField(default=1)
    beds = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    size = models.IntegerField()
    floor = models.IntegerField()
    furnished = models.BooleanField(default=False)
    usage_type = models.CharField(max_length=20, choices=USAGE_TYPES, blank=True)
    description = models.TextField()
    contact = models.CharField(
        max_length=15,
        validators=[
            MinLengthValidator(11),
            MaxLengthValidator(15),
            RegexValidator(r'^[0-9]+$', 'رقم التواصل يجب أن يحتوي على أرقام فقط')
        ]
    )
    featured = models.BooleanField(default=False)
    
    # الإحداثيات الجغرافية
    latitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, verbose_name='خط العرض')
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, verbose_name='خط الطول')
    
    # Approval Fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    owner = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='properties')
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey('users.UserProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_properties')
    approval_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"Image for {self.property_id} (order={self.order})"


class PropertyVideo(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='videos')
    video = models.FileField(upload_to='property_videos/')
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"Video for {self.property_id} (order={self.order})"


class Offer(models.Model):
    """نموذج العروض الخاصة والترويجية"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount_percentage = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    target_audience = models.CharField(
        max_length=50,
        choices=[
            ('students', 'طلاب'),
            ('families', 'عائلات'),
            ('studio', 'استوديو'),
            ('daily', 'حجز يومي'),
            ('rooms', 'غرف'),
            ('all', 'الجميع'),
        ],
        default='all'
    )
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True, help_text="اتركه فارغاً للعرض الدائم")
    icon_type = models.CharField(
        max_length=50,
        choices=[
            ('graduation', 'تخرج'),
            ('gift', 'هدية'),
            ('star', 'نجمة'),
            ('sparkles', 'براق'),
        ],
        default='sparkles'
    )
    terms = models.TextField(blank=True, help_text="شروط العرض")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.discount_percentage}%"
    
    class Meta:
        verbose_name = "عرض"
        verbose_name_plural = "العروض"
        ordering = ['-created_at']

class ContactMessage(models.Model):
    """نموذج رسائل التواصل"""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.subject} - {self.name}"
    
    class Meta:
        verbose_name = "رسالة تواصل"
        verbose_name_plural = "رسائل التواصل"
        ordering = ['-created_at']