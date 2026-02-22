import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Building2, X, Search, Download } from 'lucide-react';
import API from '@/api';

interface PropertyData {
  id: string;
  name: string;
  owner_name?: string; // اسم الحساب
  area_data?: {
    id: number;
    name: string;
  };
  created_at: string;
  submitted_at: string;
  original_contact?: string; // رقم التواصل الأول الذي أدخله العميل
  contact?: string; // رقم التواصل الحالي
  status?: 'pending' | 'approved' | 'rejected'; // حالة العقار
}

const CustomerData = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/properties/', {
          params: { limit: 1000 }
        });
        
        // Handle both single item and list responses
        const propertyList = Array.isArray(data) ? data : data.results || [];
        setProperties(propertyList);
        setFilteredProperties(propertyList);
        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("فشل تحميل بيانات العملاء");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProperties(
        properties.filter(
          (prop) =>
            prop.name.toLowerCase().includes(term) ||
            (prop.owner_name?.toLowerCase().includes(term)) ||
            (prop.area_data?.name?.toLowerCase().includes(term)) ||
            (prop.contact?.includes(searchTerm)) ||
            (prop.original_contact?.includes(searchTerm)) ||
            getStatusDisplay(prop.status).text.includes(searchTerm)
        )
      );
    }
  }, [searchTerm, properties]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case 'pending':
        return { text: 'معلق', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' };
      case 'approved':
        return { text: 'موافق عليه', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' };
      case 'rejected':
        return { text: 'مرفوض', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' };
      default:
        return { text: 'غير محدد', bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200' };
    }
  };

  const exportToExcel = () => {
    if (filteredProperties.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const headers = [
      'اسم العقار',
      'اسم الحساب',
      'الموقع',
      'رقم الهاتف الحالي',
      'تاريخ الإضافة',
      'رقم التواصل الأول'
    ];

    const rows = filteredProperties.map(prop => [
      prop.name,
      prop.owner_name || 'غير محدد',
      prop.area_data?.name || 'غير محدد',
      prop.contact || 'غير محدد',
      formatDate(prop.created_at || prop.submitted_at),
      prop.original_contact || 'غير محدد'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `بيانات_العملاء_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout title="بيانات العملاء">
      <div className="space-y-6">
        {/* Header with search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  قائمة جميع العقارات
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  عرض تفصيلي لجميع العقارات (المعلقة، الموافق عليها، المرفوضة)
                </p>
              </div>
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{filteredProperties.length}</p>
                <p className="text-xs md:text-sm text-gray-600">عقار مضاف</p>
              </div>
            </div>

            {/* Search bar and export button */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن عقار أو عميل أو رقم هاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 md:py-3 rounded-lg border border-gray-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <button
                onClick={exportToExcel}
                disabled={filteredProperties.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 md:py-3 rounded-lg bg-green-100 text-green-700 font-medium text-sm hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">تحميل Excel</span>
                <span className="sm:hidden">تحميل</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 md:p-4 text-xs md:text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">جاري تحميل البيانات...</p>
            </div>
          </div>
        )}

        {/* Table - Desktop view */}
        {!loading && filteredProperties.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      اسم العقار
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      اسم الحساب
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      الموقع
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      أرقام التواصل
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      تاريخ الإضافة
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProperties.map((property, index) => (
                    <tr
                      key={property.id}
                      className={`transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-100'
                      }`}
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 font-medium">
                        <a
                          href={`/property/${property.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {property.name}
                        </a>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {property.owner_name || 'غير محدد'}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {property.area_data?.name || 'غير محدد'}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-1">
                          <div>
                            <p className="text-gray-500 text-[11px] md:text-xs">الحالي:</p>
                            <a
                              href={`tel:${property.contact}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {property.contact || 'غير'}
                            </a>
                          </div>
                          {property.contact !== property.original_contact && (
                            <>
                              <div className="hidden md:block text-gray-300">|</div>
                              <div>
                                <p className="text-gray-500 text-[11px] md:text-xs">الأول:</p>
                                <a
                                  href={`tel:${property.original_contact}`}
                                  className="text-amber-600 hover:text-amber-800 hover:underline"
                                >
                                  {property.original_contact || 'غير'}
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {formatDate(property.created_at || property.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredProperties.map((property, index) => (
                <div key={property.id} className={`p-4 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-100'
                }`}>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">اسم العقار</p>
                      <a
                        href={`/property/${property.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {property.name}
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600">اسم الحساب</p>
                        <p className="font-medium text-gray-900">{property.owner_name || 'غير محدد'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">الموقع</p>
                        <p className="font-medium text-gray-900">{property.area_data?.name || 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="flex-1 min-w-[140px]">
                          <p className="text-gray-600 mb-1">الحالي</p>
                          <a
                            href={`tel:${property.contact}`}
                            className="font-medium text-blue-600 hover:text-blue-800 block"
                          >
                            {property.contact || 'غير'}
                          </a>
                        </div>
                        {property.contact !== property.original_contact && (
                          <div className="flex-1 min-w-[140px]">
                            <p className="text-gray-600 mb-1">الأول</p>
                            <a
                              href={`tel:${property.original_contact}`}
                              className="font-medium text-amber-600 hover:text-amber-800 block"
                            >
                              {property.original_contact || 'غير'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                      <p>التاريخ: {formatDate(property.created_at || property.submitted_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProperties.length === 0 && !error && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-12 text-center">
            <Building2 className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-base md:text-lg font-medium">
              {searchTerm ? 'لم يتم العثور على نتائج' : 'لا توجد عقارات مضافة حتى الآن'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                مسح البحث والمحاولة مرة أخرى
              </button>
            )}
          </div>
        )}


      </div>
    </DashboardLayout>
  );
};

export default CustomerData;
