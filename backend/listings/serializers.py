from rest_framework import serializers
from .models import Area, Property, PropertyImage, PropertyVideo, Offer, ContactMessage
from decimal import Decimal, InvalidOperation
import logging

logger = logging.getLogger(__name__)

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = PropertyImage
        fields = ('id', 'image_url', 'order')
    def get_image_url(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

class PropertyVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    class Meta:
        model = PropertyVideo
        fields = ('id', 'video_url', 'order')
    def get_video_url(self, obj):
        request = self.context.get('request')
        if request and obj.video:
            return request.build_absolute_uri(obj.video.url)
        return None

class AreaSerializer(serializers.ModelSerializer):
    property_count = serializers.SerializerMethodField()
    class Meta:
        model = Area
        fields = ('id', 'name', 'property_count')
    def get_property_count(self, obj):
        return obj.properties.count()

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    area_data = serializers.SerializerMethodField()
    area = serializers.PrimaryKeyRelatedField(
        queryset=Area.objects.all(),
        write_only=False,
        allow_null=False,
        required=True
    )
    usage_type_ar = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    owner_name = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    
    def get_usage_type_ar(self, obj):
        """تحويل usage_type إلى العربية"""
        usage_type_map = {
            'students': 'طلاب',
            'families': 'عائلات',
            'studio': 'استوديو',
            'vacation': 'مصيفين',
            'daily': 'حجز يومي',
        }
        return usage_type_map.get(obj.usage_type, obj.get_usage_type_display() if obj.usage_type else '')
    
    def get_area_data(self, obj):
        """آمن - التعامل مع NULL area"""
        if obj.area:
            return AreaSerializer(obj.area).data
        return None
    
    def get_owner_name(self, obj):
        """آمن - التعامل مع NULL values"""
        if obj.owner and obj.owner.user:
            return obj.owner.user.get_full_name() or obj.owner.user.username
        return 'غير محدد'
    
    def get_approved_by_name(self, obj):
        """آمن - التعامل مع NULL values"""
        if obj.approved_by and obj.approved_by.user:
            return obj.approved_by.user.get_full_name() or obj.approved_by.user.username
        return None
    
    def validate_contact(self, value):
        """التحقق من أن رقم التواصل أرقام فقط وبين 11 و 15"""
        if not value.isdigit():
            raise serializers.ValidationError("رقم التواصل يجب أن يحتوي على أرقام فقط")
        if len(value) < 11 or len(value) > 15:
            raise serializers.ValidationError("رقم التواصل يجب أن يكون بين 11 و 15 رقم")
        return value
    
    @staticmethod
    def _parse_coordinate(value, coord_type='latitude'):
        """
        دالة شاملة لتحويل الإحداثيات بشكل آمن وموثوق
        تتعامل مع: strings، floats، ints، Decimals، وأي نوع بيانات
        """
        # معالجة القيم الفارغة والـ None
        if value is None or value == '' or value == 'null' or value == 'undefined':
            return None
        
        try:
            # التحويل إلى string أولاً ثم تنظيفه
            str_value = str(value).strip()
            
            # تجاهل القيم الفارغة بعد التنظيف
            if not str_value or str_value.lower() in ['none', 'null', 'undefined', 'nan']:
                return None
            
            # التحويل إلى Decimal (أدق من float)
            try:
                decimal_value = Decimal(str_value)
            except (InvalidOperation, ValueError):
                # محاولة تحويل float إذا فشل Decimal
                float_value = float(str_value)
                if not (-180 <= float_value <= 180 if coord_type == 'longitude' else -90 <= float_value <= 90):
                    return None
                decimal_value = Decimal(str(float_value))
            
            # التحقق من النطاق المسموح
            if coord_type == 'latitude':
                if decimal_value < Decimal('-90') or decimal_value > Decimal('90'):
                    logger.warning(f"Latitude خارج النطاق: {decimal_value}")
                    return None
            else:  # longitude
                if decimal_value < Decimal('-180') or decimal_value > Decimal('180'):
                    logger.warning(f"Longitude خارج النطاق: {decimal_value}")
                    return None
            
            # التقريب إلى 8 أرقام عشرية بأمان
            quantized = decimal_value.quantize(Decimal('0.00000001'))
            
            logger.info(f"تم تحويل {coord_type}: {value} → {quantized}")
            return quantized
            
        except Exception as e:
            logger.error(f"خطأ في تحويل {coord_type}: {value} - {str(e)}")
            return None
    
    def validate_latitude(self, value):
        """التحقق من صحة latitude مع معالجة شاملة للأخطاء"""
        result = self._parse_coordinate(value, 'latitude')
        # إذا لم نتمكن من التحويل، نرجع None بدلاً من رفع خطأ
        # لأن حقل latitude اختياري (null=True, blank=True)
        return result
    
    def validate_longitude(self, value):
        """التحقق من صحة longitude مع معالجة شاملة للأخطاء"""
        result = self._parse_coordinate(value, 'longitude')
        # إذا لم نتمكن من التحويل، نرجع None بدلاً من رفع خطأ
        # لأن حقل longitude اختياري (null=True, blank=True)
        return result
    
    class Meta:
        model = Property
        fields = (
            'id', 'name', 'area', 'area_data', 'address', 'price', 'original_price', 'discount', 'rooms', 'beds', 'bathrooms',
            'size', 'floor', 'furnished', 'usage_type', 'usage_type_ar',
            'description', 'contact', 'featured',
            'latitude', 'longitude',
            'images', 'videos', 'created_at', 'updated_at',
            # حقول الموافقات
            'owner', 'owner_name', 'status', 'status_display', 'submitted_at',
            'approved_by', 'approved_by_name', 'approval_notes'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'submitted_at', 'approved_by', 'approval_notes', 'status', 'status_display', 'owner', 'owner_name', 'area_data')
        extra_kwargs = {
            'name': {'required': True},
            'area': {'required': True},
            'address': {'required': True},
            'price': {'required': True},
            'rooms': {'required': True},
            'beds': {'required': True},
            'bathrooms': {'required': True},
            'description': {'required': True},
            'size': {'required': True},
            'floor': {'required': True},
            'contact': {'required': True},
            'usage_type': {'required': False},
        }


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = (
            'id',
            'title',
            'description',
            'discount_percentage',
            'target_audience',
            'is_active',
            'start_date',
            'end_date',
            'icon_type',
            'terms',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = (
            'id',
            'name',
            'email',
            'subject',
            'message',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')


