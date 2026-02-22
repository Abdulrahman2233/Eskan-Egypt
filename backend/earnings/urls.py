from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserEarningViewSet

router = DefaultRouter()
router.register(r'deals', UserEarningViewSet, basename='deals')

app_name = 'earnings'

urlpatterns = [
    path('', include(router.urls)),
]

# استخدام:
# GET /api/earnings/deals/ - قائمة جميع الأرباح
# POST /api/earnings/deals/ - إنشاء أرباح جديدة
# GET /api/earnings/deals/{id}/ - تفاصيل الربح
# PUT /api/earnings/deals/{id}/ - تحديث الربح
# DELETE /api/earnings/deals/{id}/ - حذف الربح
# GET /api/earnings/deals/summary/ - ملخص الأرباح
# GET /api/earnings/deals/by_type/ - الأرباح حسب النوع
# GET /api/earnings/deals/by_area/ - الأرباح حسب المنطقة
# GET /api/earnings/deals/monthly/ - الأرباح الشهرية
