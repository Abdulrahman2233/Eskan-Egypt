/**
 * اختبارات سريعة للـ Analytics Components
 * 
 * يمكن تشغيلها بـ:
 * npm test -- Analytics.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Analytics from '../pages/Analytics';
import { StatCard } from '../components/dashboard/ChartComponents';
import * as API from '../api';

// Mock API
jest.mock('../api');

describe('Analytics Page', () => {
  
  const mockAnalyticsData = {
    properties: {
      total: 100,
      approved: 80,
      pending: 15,
      draft: 5,
      rejected: 0,
      total_value: 5000000,
      avg_price: 50000,
    },
    users: {
      total: 500,
      new_today: 10,
      by_type: { admin: 5, landlord: 100, tenant: 395 },
      active_users: 450,
    },
    areas: [
      { name: 'المنطقة 1', property_count: 20, avg_price: 45000, total_value: 900000 },
    ],
    property_types: [
      { name: 'عائلات', value: 50, avg_price: 55000 },
    ],
    offers: { active: 5, total: 10, avg_discount: 20 },
    contact_messages: { total: 100, today: 5, avg_per_day: 3.3 },
    price_distribution: [
      { label: 'أقل من 10,000', value: 5 },
    ],
    recent_activities: [
      {
        id: 1,
        user: 'Admin User',
        action: 'إضافة عقار',
        object_name: 'عقار تجريبي',
        timestamp: new Date().toISOString(),
        description: 'تم إضافة عقار جديد',
      },
    ],
    top_properties: [
      {
        id: '1',
        name: 'عقار تجريبي',
        area: 'المنطقة 1',
        price: 50000,
        rooms: 2,
        images_count: 5,
        featured: false,
      },
    ],
    daily_activity: [
      { date: '2024-01-25', count: 10 },
      { date: '2024-01-26', count: 15 },
    ],
  };

  beforeEach(() => {
    // Mock API response
    (API.default.get as jest.Mock).mockResolvedValue({
      data: mockAnalyticsData,
    });
  });

  test('يتم تحميل صفحة التحليلات بنجاح', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // التحقق من ظهور العنوان
    expect(
      await waitFor(() =>
        screen.getByText('لوحة التحكم التحليلية')
      )
    ).toBeInTheDocument();
  });

  test('يتم عرض بطاقات الإحصائيات', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // التحقق من ظهور بطاقات الإحصائيات
    await waitFor(() => {
      expect(screen.getByText('إجمالي العقارات')).toBeInTheDocument();
      expect(screen.getByText('إجمالي المستخدمين')).toBeInTheDocument();
    });
  });

  test('يتم عرض الرسوم البيانية', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // التحقق من ظهور الرسوم البيانية
    await waitFor(() => {
      expect(screen.getByText('توزيع أنواع العقارات')).toBeInTheDocument();
      expect(screen.getByText('توزيع الأسعار')).toBeInTheDocument();
      expect(screen.getByText('النشاط اليومي (آخر 30 يوم)')).toBeInTheDocument();
    });
  });

  test('يتم عرض الجداول', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // التحقق من ظهور الجداول
    await waitFor(() => {
      expect(screen.getByText('أفضل 10 مناطق')).toBeInTheDocument();
      expect(screen.getByText('أفضل العقارات')).toBeInTheDocument();
      expect(screen.getByText('آخر الأنشطة')).toBeInTheDocument();
    });
  });

  test('يتم عرض رسالة خطأ في حالة فشل التحميل', async () => {
    (API.default.get as jest.Mock).mockRejectedValue(
      new Error('Network Error')
    );

    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // التحقق من ظهور رسالة خطأ
    expect(
      await screen.findByText('فشل تحميل بيانات التحليلات')
    ).toBeInTheDocument();
  });
});

describe('StatCard Component', () => {
  
  test('يتم عرض البطاقة بشكل صحيح', () => {
    const { container } = render(
      <StatCard
        title="اختبار"
        value={100}
        description="وصف اختبار"
        icon={<div>📊</div>}
      />
    );

    expect(screen.getByText('اختبار')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('وصف اختبار')).toBeInTheDocument();
  });

  test('يتم عرض الاتجاه إذا كان موجوداً', () => {
    render(
      <StatCard
        title="اختبار"
        value={100}
        trend={5}
        icon={<div>📊</div>}
      />
    );

    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  test('يتم تطبيق اللون المخصص', () => {
    const { container } = render(
      <StatCard
        title="اختبار"
        value={100}
        icon={<div>📊</div>}
        bgColor="bg-red-50"
      />
    );

    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
  });
});

describe('Integration Tests', () => {
  
  test('الـ API يتم استدعاؤه مع الـ correct URL', async () => {
    (API.default.get as jest.Mock).mockResolvedValue({
      data: mockAnalyticsData,
    });

    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(API.default.get).toHaveBeenCalledWith(
        '/listings/analytics/summary/'
      );
    });
  });

  test('البيانات يتم تحديثها بنجاح', async () => {
    (API.default.get as jest.Mock).mockResolvedValue({
      data: mockAnalyticsData,
    });

    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // التحقق من أن البيانات تم تحميلها بنجاح
    await waitFor(() => {
      expect(screen.getByText('إجمالي العقارات')).toBeInTheDocument();
    });

    // التحقق من أن البيانات الصحيحة يتم عرضها
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
