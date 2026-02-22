from rest_framework import serializers
from .models import UserEarning


class UserEarningSerializer(serializers.ModelSerializer):
    """
    Serializer لنموذج أرباح المستخدم
    """
    user_id = serializers.IntegerField(read_only=True)
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    
    class Meta:
        model = UserEarning
        fields = [
            'id',
            'user_id',
            'property_name',
            'area',
            'property_type',
            'property_type_display',
            'earnings',
            'deal_date',
            'notes',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """
        إنشاء سجل أرباح جديد للمستخدم الحالي
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class EarningsSummarySerializer(serializers.Serializer):
    """
    Serializer لملخص الأرباح
    """
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    this_month_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    last_month_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_deal = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_deals = serializers.IntegerField()
    growth_percentage = serializers.FloatField()
