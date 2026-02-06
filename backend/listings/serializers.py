from rest_framework import serializers
from .models import Area, Property, PropertyImage, PropertyVideo

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
        fields = ('id', 'name', 'name_en', 'property_count')
    def get_property_count(self, obj):
        return obj.properties.count()

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    area = serializers.SerializerMethodField()
    usage_type_ar = serializers.CharField(source='get_usage_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    owner_name = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    
    def get_area(self, obj):
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
    
    class Meta:
        model = Property
        fields = (
            'id', 'name', 'name_en', 'area', 'address', 'price', 'rooms', 'bathrooms',
            'size', 'floor', 'furnished', 'type', 'usage_type', 'usage_type_ar',
            'type_en', 'description', 'description_en', 'contact', 'featured',
            'images', 'videos', 'created_at', 'updated_at',
            # حقول الموافقات
            'owner', 'owner_name', 'status', 'status_display', 'submitted_at',
            'approved_by', 'approved_by_name', 'approval_notes'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'submitted_at', 'approved_by', 'approval_notes', 'status', 'status_display', 'owner', 'owner_name')
