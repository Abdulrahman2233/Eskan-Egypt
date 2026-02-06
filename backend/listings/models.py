import uuid
from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator, MinValueValidator, MaxValueValidator
from django.utils import timezone


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
    
    # المشاهدات والزيارات
    views = models.IntegerField(default=0, verbose_name='عدد المشاهدات')
    visitors = models.IntegerField(default=0, verbose_name='عدد الزيارات')
    visited_ips = models.JSONField(default=dict, blank=True, verbose_name='IP Addresses التي زارت العقار')
    
    # Approval Fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    owner = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='properties')
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey('users.UserProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_properties')
    approval_notes = models.TextField(blank=True)
    
    # حقول الحذف المنطقي
    is_deleted = models.BooleanField(default=False, verbose_name='هل تم الحذف')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الحذف')
    deleted_by = models.ForeignKey('users.UserProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_properties', verbose_name='تم الحذف بواسطة')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def record_view(self, ip_address):
        """تسجيل مشاهدة جديدة للعقار"""
        self.views += 1
        
        # تتبع عناوين IP الفريدة للعقار
        if not self.visited_ips:
            self.visited_ips = {}
        
        # إذا كان هذا IP جديداً، زد عداد الزيارات الفريدة
        if ip_address not in self.visited_ips:
            self.visited_ips[ip_address] = 1
            self.visitors += 1
        else:
            self.visited_ips[ip_address] += 1
        
        self.save()

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
    name = models.CharField(max_length=100, verbose_name='الاسم')
    email = models.EmailField(verbose_name='البريد الإلكتروني')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='رقم الهاتف')
    subject = models.CharField(max_length=200, verbose_name='الموضوع')
    message = models.TextField(verbose_name='الرسالة')
    is_read = models.BooleanField(default=False, verbose_name='مقروءة')
    is_archived = models.BooleanField(default=False, verbose_name='مؤرشفة')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='وقت الإرسال')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخر تحديث')
    
    def __str__(self):
        return f"{self.subject} - {self.name}"
    
    class Meta:
        verbose_name = "رسالة تواصل"
        verbose_name_plural = "رسائل التواصل"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_read', '-created_at']),
        ]


class ActivityLog(models.Model):
    """نموذج سجل نشاط المستخدمين"""
    ACTION_CHOICES = [
        ('create_property', 'إضافة عقار جديد'),
        ('delete_property', 'حذف عقار'),
        ('update_property', 'تعديل عقار'),
        ('create_user', 'إنشاء حساب جديد'),
        ('approve_property', 'الموافقة على عقار'),
        ('reject_property', 'رفض عقار'),
    ]
    
    user = models.ForeignKey(
        'users.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs',
        verbose_name='المستخدم'
    )
    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES,
        verbose_name='نوع النشاط'
    )
    content_type = models.CharField(
        max_length=50,
        choices=[
            ('property', 'عقار'),
            ('user', 'مستخدم'),
        ],
        verbose_name='نوع المحتوى'
    )
    object_id = models.CharField(
        max_length=500,
        verbose_name='معرف الكائن',
        blank=True
    )
    object_name = models.CharField(
        max_length=500,
        verbose_name='اسم الكائن',
        blank=True
    )
    description = models.TextField(
        verbose_name='الوصف',
        blank=True
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='عنوان IP'
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='الوقت'
    )
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'سجل النشاط'
        verbose_name_plural = 'سجلات النشاط'
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.user} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class PropertyAuditTrail(models.Model):
    """
    نموذج تتبع تاريخ التعديلات والحذف على العقارات
    يسجل جميع العمليات التي تتم على العقار
    """
    ACTION_CHOICES = [
        ('create', 'إنشاء'),
        ('delete', 'حذف'),
        ('restore', 'استرجاع'),
        ('approve', 'موافقة'),
        ('reject', 'رفض'),
    ]
    
    # العقار
    property = models.ForeignKey(
        'Property',
        on_delete=models.CASCADE,
        related_name='audit_trail',
        verbose_name='العقار'
    )
    
    # العملية
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name='نوع العملية'
    )
    
    # من قام بالعملية
    performed_by = models.ForeignKey(
        'users.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='property_audit_logs',
        verbose_name='تم بواسطة'
    )
    
    # البيانات القديمة (snapshot من قبل الحذف)
    property_data_before = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='بيانات العقار قبل العملية'
    )
    
    # البيانات الجديدة (snapshot بعد العملية)
    property_data_after = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='بيانات العقار بعد العملية'
    )
    
    # الملاحظات أو السبب
    notes = models.TextField(
        blank=True,
        verbose_name='ملاحظات/السبب'
    )
    
    # عنوان IP
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='عنوان IP'
    )
    
    # الوقت
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='الوقت'
    )
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'سجل تدقيق العقار'
        verbose_name_plural = 'سجلات تدقيق العقارات'
        indexes = [
            models.Index(fields=['property', '-timestamp']),
            models.Index(fields=['-timestamp']),
            models.Index(fields=['action', '-timestamp']),
            models.Index(fields=['performed_by', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.property.name} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class Visitor(models.Model):
    """نموذج لتتبع الزوار الفريدين للموقع"""
    
    DEVICE_TYPE_CHOICES = [
        ('mobile', 'هاتف'),
        ('tablet', 'تابلت'),
        ('desktop', 'كمبيوتر'),
        ('unknown', 'غير معروف'),
    ]
    
    ip_address = models.GenericIPAddressField(verbose_name='عنوان IP', unique=True)
    user_agent = models.TextField(verbose_name='بيانات المتصفح', blank=True)
    device_type = models.CharField(
        max_length=20, 
        choices=DEVICE_TYPE_CHOICES, 
        default='unknown',
        verbose_name='نوع الجهاز'
    )
    country = models.CharField(max_length=100, verbose_name='الدولة', blank=True)
    city = models.CharField(max_length=100, verbose_name='المدينة', blank=True)
    visit_count = models.IntegerField(default=1, verbose_name='عدد الزيارات')
    last_visited = models.DateTimeField(auto_now=True, verbose_name='آخر زيارة')
    first_visited = models.DateTimeField(auto_now_add=True, verbose_name='أول زيارة')
    
    class Meta:
        verbose_name = 'زائر'
        verbose_name_plural = 'الزوار'
        ordering = ['-last_visited']
        indexes = [
            models.Index(fields=['ip_address']),
            models.Index(fields=['-last_visited']),
        ]
    
    def __str__(self):
        return f"{self.ip_address} - {self.visit_count} زيارة"
    
    @staticmethod
    def detect_device_type(user_agent=''):
        """كشف نوع الجهاز من user_agent"""
        user_agent_lower = user_agent.lower()
        
        # كشف الهاتف
        mobile_keywords = ['mobile', 'android', 'iphone', 'ipod', 'windows phone', 'blackberry']
        if any(keyword in user_agent_lower for keyword in mobile_keywords):
            return 'mobile'
        
        # كشف التابلت
        tablet_keywords = ['ipad', 'tablet', 'kindle', 'playbook', 'nexus 7', 'nexus 10']
        if any(keyword in user_agent_lower for keyword in tablet_keywords):
            return 'tablet'
        
        # كشف الكمبيوتر
        desktop_keywords = ['windows', 'macintosh', 'linux', 'x11', 'unix']
        if any(keyword in user_agent_lower for keyword in desktop_keywords):
            return 'desktop'
        
        return 'unknown'
    
    @staticmethod
    def record_visitor(ip_address, user_agent=''):
        """تسجيل زائر جديد أو تحديث الزائر الموجود"""
        device_type = Visitor.detect_device_type(user_agent)
        visitor, created = Visitor.objects.get_or_create(
            ip_address=ip_address,
            defaults={
                'user_agent': user_agent,
                'device_type': device_type,
                'visit_count': 1,
            }
        )
        if not created:
            # إذا كان الزائر موجوداً، زد عدد الزيارات
            visitor.visit_count += 1
            visitor.user_agent = user_agent  # تحديث بيانات المتصفح
            visitor.device_type = device_type  # تحديث نوع الجهاز
            visitor.user_agent = user_agent  # تحديث بيانات المتصفح
            visitor.save()
        return visitor


class Transaction(models.Model):
    """نموذج الصفقات والأرباح"""
    
    ACCOUNT_TYPE_CHOICES = [
        ('owner', 'مالك'),
        ('agent', 'وسيط'),
        ('office', 'مكتب عقارات'),
        ('tenant', 'مستأجر'),
    ]
    
    PROPERTY_TYPE_CHOICES = [
        ('students', 'طلاب'),
        ('families', 'عائلات'),
        ('studio', 'استوديو'),
        ('vacation', 'مصيفين'),
        ('daily', 'حجز يومي'),
    ]
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    user = models.ForeignKey(
        'users.UserProfile',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='transactions',
        verbose_name='المستخدم'
    )
    property_name = models.CharField(max_length=200, verbose_name='اسم العقار')
    region = models.CharField(max_length=100, verbose_name='المنطقة')
    account_type = models.CharField(
        max_length=20,
        choices=ACCOUNT_TYPE_CHOICES,
        verbose_name='نوع الحساب'
    )
    property_type = models.CharField(
        max_length=20,
        choices=PROPERTY_TYPE_CHOICES,
        verbose_name='نوع العقار'
    )
    rent_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='سعر الإيجار'
    )
    commission = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name='العمولة'
    )
    profit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name='الربح'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التعديل')
    
    class Meta:
        verbose_name = 'صفقة'
        verbose_name_plural = 'الصفقات'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['account_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.property_name} - {self.profit} ج.م - {self.created_at.strftime('%Y-%m-%d')}"


class Notification(models.Model):
    """نموذج الإشعارات للمستخدمين"""
    NOTIFICATION_TYPES = [
        ('property', 'عقار جديد'),
        ('message', 'رسالة جديدة'),
        ('user', 'مستخدم جديد'),
        ('view', 'مشاهدات عالية'),
        ('approval', 'موافقة على عقار'),
        ('rejection', 'رفض عقار'),
    ]
    
    id = models.UUIDField(primary_key=True, default=generate_uuid, editable=False)
    recipient = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='notifications', verbose_name='المستقبل')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, verbose_name='نوع الإشعار')
    title = models.CharField(max_length=200, verbose_name='العنوان')
    description = models.TextField(verbose_name='الوصف')
    
    # Relations
    related_property = models.ForeignKey(Property, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications', verbose_name='العقار المتعلق')
    related_user = models.ForeignKey('users.UserProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications', verbose_name='المستخدم المتعلق')
    
    # Status
    is_read = models.BooleanField(default=False, verbose_name='هل تم القراءة')
    read_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ القراءة')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التعديل')
    
    class Meta:
        verbose_name = 'إشعار'
        verbose_name_plural = 'الإشعارات'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['recipient', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.user.username}"
    
    def mark_as_read(self):
        """تحديد الإشعار كمقروء"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()