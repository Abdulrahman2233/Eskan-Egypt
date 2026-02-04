import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { handleError, isAuthError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://abdo238923.pythonanywhere.com/api";

// Configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const REQUEST_TIMEOUT = 30000; // 30 seconds
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Track retry count per request
const retryCount = new WeakMap<InternalAxiosRequestConfig, number>();

// Axios instance
const API = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: REQUEST_TIMEOUT,
});

/**
 * Sleep utility for retry delay
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if request is retryable
 */
const isRetryable = (error: AxiosError): boolean => {
  // Don't retry if no response
  if (!error.response) return true;

  // Only retry specific status codes
  return RETRYABLE_STATUS_CODES.includes(error.response.status);
};

// ============ Request Interceptor ============
API.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem("access_token") || localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Initialize retry count
    retryCount.set(config, retryCount.get(config) || 0);

    // Log request in development
    if (import.meta.env.DEV) {
      logger.debug(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    logger.error("Request interceptor error", error);
    return Promise.reject(error);
  }
);

// ============ Response Interceptor ============
API.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      logger.debug(`📥 API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;

    // Handle retry logic
    if (config && isRetryable(error)) {
      const currentRetryCount = retryCount.get(config) || 0;

      if (currentRetryCount < MAX_RETRIES) {
        // Increment retry count
        retryCount.set(config, currentRetryCount + 1);

        const delayMs = RETRY_DELAY * Math.pow(2, currentRetryCount); // Exponential backoff
        logger.info(`🔄 Retrying request (${currentRetryCount + 1}/${MAX_RETRIES}) after ${delayMs}ms`, {
          url: config.url,
          status: error.response?.status,
        });

        await sleep(delayMs);
        return API(config);
      }
    }

    // Handle authentication errors - redirect to login
    const appError = handleError(error, "API Request", false);

    if (isAuthError(appError)) {
      logger.warn("Authentication error - redirecting to login");
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }

    // Log final error
    if (error.response) {
      logger.error(`❌ API Error: ${error.response.status} ${config?.url}`, {
        status: error.response.status,
        data: error.response.data,
        retries: retryCount.get(config) || 0,
      });
    } else if (error.request) {
      logger.error("No response from API server", {
        url: config?.url,
        timeout: config?.timeout,
      });
    } else {
      logger.error("Error setting up request", error.message);
    }

    return Promise.reject(appError);
  }
);

export default API;

// ============ Authentication ============
export async function changePassword(data: {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}): Promise<Record<string, unknown>> {
  try {
    const response = await API.post("/users/auth/change-password/", data);
    return response.data;
  } catch (error) {
    handleError(error, "Change Password");
    throw error;
  }
}

export async function updateProfile(profileData: Record<string, unknown>): Promise<Record<string, unknown>> {
  try {
    const response = await API.put("/users/auth/me/", profileData);
    return response.data;
  } catch (error) {
    handleError(error, "Update Profile");
    throw error;
  }
}

// ============ Properties ============
export async function fetchProperties() {
  try {
    const { data } = await API.get("/properties/");
    return data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

export async function fetchProperty(id: string) {
  try {
    const { data } = await API.get(`/properties/${id}/`);
    return data;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
}

export async function fetchPropertiesByStatus(status: string) {
  try {
    const { data } = await API.get("/properties/", { params: { status } });
    return data;
  } catch (error) {
    console.error("Error fetching properties by status:", error);
    throw error;
  }
}

export async function fetchUserProperties() {
  try {
    const { data } = await API.get("/properties/my_properties/");
    return data;
  } catch (error) {
    console.error("Error fetching user properties:", error);
    throw error;
  }
}

export async function createProperty(propertyData: FormData): Promise<Record<string, unknown>> {
  try {
    const { data } = await API.post("/properties/", propertyData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Create Property");
    throw error;
  }
}

export async function updateProperty(id: string, propertyData: FormData): Promise<Record<string, unknown>> {
  try {
    const { data } = await API.put(`/properties/${id}/`, propertyData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    handleError(error, "Update Property");
    throw error;
  }
}

export async function deleteProperty(id: string) {
  try {
    await API.delete(`/properties/${id}/`);
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
}

export async function submitPropertyForApproval(id: string) {
  try {
    const { data } = await API.post(`/properties/${id}/submit-for-approval/`);
    return data;
  } catch (error) {
    console.error("Error submitting property:", error);
    throw error;
  }
}

export async function resubmitRejectedProperty(id: string) {
  try {
    const { data } = await API.post(`/properties/${id}/resubmit/`);
    return data;
  } catch (error) {
    console.error("Error resubmitting property:", error);
    throw error;
  }
}

// ============ Areas ============
export async function fetchAreas() {
  try {
    const { data } = await API.get("/areas/");
    return data;
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
}

// ============ Approval Endpoints (Admin) ============
export async function fetchPendingProperties() {
  try {
    const { data } = await API.get("/properties/pending/");
    return data;
  } catch (error) {
    console.error("Error fetching pending properties:", error);
    throw error;
  }
}

export async function fetchApprovedProperties() {
  try {
    const { data } = await API.get("/properties/", { params: { status: 'approved' } });
    return data;
  } catch (error) {
    console.error("Error fetching approved properties:", error);
    throw error;
  }
}

export async function fetchRejectedProperties() {
  try {
    const { data } = await API.get("/properties/rejected/");
    return data;
  } catch (error) {
    console.error("Error fetching rejected properties:", error);
    throw error;
  }
}

export async function approveProperty(id: string, notes?: string) {
  try {
    const { data } = await API.post(`/properties/${id}/approve/`, { approval_notes: notes || '' });
    return data;
  } catch (error) {
    console.error("Error approving property:", error);
    throw error;
  }
}

export async function rejectProperty(id: string, notes: string) {
  try {
    if (!notes || notes.trim().length === 0) {
      throw new Error('يجب إدخال سبب الرفض');
    }
    const { data } = await API.post(`/properties/${id}/reject/`, { approval_notes: notes });
    return data;
  } catch (error) {
    console.error("Error rejecting property:", error);
    throw error;
  }
}

export async function fetchApprovalStatistics() {
  try {
    const { data } = await API.get("/properties/statistics/");
    return data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
}

// ============ Search & Filter ============
export async function searchProperties(filters: Record<string, unknown>): Promise<Record<string, unknown>> {
  try {
    // تحويل الفلاتر إلى صيغة صحيحة
    const params = {
      ...filters,
      search: filters.search || '',
    };
    const { data } = await API.get("/properties/", { params });
    return data;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
}

// ============ Contact Messages ============
export async function sendContactMessage(messageData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const { data } = await API.post("/contact-messages/", messageData);
    return data;
  } catch (error) {
    console.error("Error sending contact message:", error);
    throw error;
  }
}

export async function fetchContactMessages() {
  try {
    const { data } = await API.get("/contact-messages/");
    return data;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: number) {
  try {
    const { data } = await API.patch(`/contact-messages/${messageId}/`, {
      is_read: true,
    });
    return data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}

export async function deleteContactMessage(messageId: number) {
  try {
    await API.delete(`/contact-messages/${messageId}/`);
  } catch (error) {
    console.error("Error deleting contact message:", error);
    throw error;
  }
}

export async function updateContactMessage(
  messageId: number,
  updateData: Record<string, unknown>
) {
  try {
    const { data } = await API.patch(
      `/contact-messages/${messageId}/`,
      updateData
    );
    return data;
  } catch (error) {
    console.error("Error updating contact message:", error);
    throw error;
  }
}

// ============ Recent Accounts ============
export async function fetchRecentAccounts(limit: number = 6) {
  try {
    const { data } = await API.get("/users/auth/recent-accounts/", { params: { limit } });
    return data;
  } catch (error) {
    console.error("Error fetching recent accounts:", error);
    throw error;
  }
}

// ============ User Statistics ============
export async function fetchUserStatistics() {
  try {
    const { data } = await API.get("/analytics/users/");
    return data;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
}

// ============ Top Owners/Agents/Offices ============
export async function fetchTopOwners(userType: string = 'landlord', limit: number = 4) {
  try {
    const { data } = await API.get("/analytics/top_owners/", {
      params: { user_type: userType, limit }
    });
    return data;
  } catch (error) {
    console.error("Error fetching top owners:", error);
    throw error;
  }
}

// ============ Dashboard Summary ============
export async function fetchDashboardSummary() {
  try {
    const { data } = await API.get("/analytics/summary/");
    return data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
}

// ============ Property Distribution by Usage Type ============
export async function fetchPropertyDistributionByUsage() {
  try {
    const { data } = await API.get("/analytics/summary/");
    // Extract property types from dashboard summary
    const propertyTypes = data.property_types || [];
    
    // Map to chart format with colors
    const colors = ["#0ea5e9", "#14b8a6", "#f97316", "#a855f7", "#ec4899"];
    return propertyTypes.map((item: any, index: number) => ({
      name: item.name,
      value: item.value,
      color: colors[index % colors.length],
      avg_price: item.avg_price
    }));
  } catch (error) {
    console.error("Error fetching property distribution:", error);
    throw error;
  }
}

// ============ Property Status Distribution ============
export async function fetchPropertyStatusDistribution() {
  try {
    const { data } = await API.get("/analytics/summary/");
    // Extract property stats from dashboard summary
    const properties = data.properties || {};
    
    // Map status data to chart format
    const statusData = [
      { name: "معلق", value: properties.pending || 0, color: "#f59e0b" },
      { name: "موافق عليه", value: properties.approved || 0, color: "#10b981" },
      { name: "محذوف", value: properties.deleted || 0, color: "#ef4444" },
      { name: "مرفوض", value: properties.rejected || 0, color: "#8b5cf6" },
    ];
    
    return statusData;
  } catch (error) {
    console.error("Error fetching property status distribution:", error);
    throw error;
  }
}

// ============ Profits/Transactions ============
/**
 * Fetch all regions/areas from the database
 */
export async function fetchRegions() {
  try {
    const { data } = await API.get("/areas/");
    return data.map((area: any) => area.name);
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}

/**
 * Fetch property types (usage types) from database
 */
export async function fetchPropertyTypes() {
  try {
    // Property types with their database keys
    return [
      { key: 'students', label: 'طلاب' },
      { key: 'families', label: 'عائلات' },
      { key: 'studio', label: 'استوديو' },
      { key: 'vacation', label: 'مصيفين' },
      { key: 'daily', label: 'حجز يومي' },
    ];
  } catch (error) {
    console.error("Error fetching property types:", error);
    throw error;
  }
}

/**
 * Fetch account types (user types) from database
 */
export async function fetchAccountTypes() {
  try {
    // Account types with their database keys
    // Returns array of display names that map to backend values
    return [
      { key: 'owner', label: 'مالك' },
      { key: 'agent', label: 'وسيط' },
      { key: 'office', label: 'مكتب عقارات' },
    ];
  } catch (error) {
    console.error("Error fetching account types:", error);
    throw error;
  }
}
// ============ Transactions/Profits ============
/**
 * Fetch all transactions for the current user
 */
export async function fetchTransactions(): Promise<any[]> {
  try {
    const { data } = await API.get("/transactions/");
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

/**
 * Fetch a single transaction by ID
 */
export async function fetchTransaction(id: string): Promise<any> {
  try {
    const { data } = await API.get(`/transactions/${id}/`);
    return data;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}

/**
 * Create a new transaction
 */
export async function createTransaction(transactionData: {
  property_name: string;
  region: string;
  account_type: string;
  property_type: string;
  rent_price: number;
  commission?: number;
  profit: number;
}): Promise<any> {
  try {
    const { data } = await API.post("/transactions/", transactionData);
    return data;
  } catch (error) {
    handleError(error, "Create Transaction");
    throw error;
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(
  id: string,
  transactionData: Record<string, unknown>
): Promise<any> {
  try {
    const { data } = await API.patch(`/transactions/${id}/`, transactionData);
    return data;
  } catch (error) {
    handleError(error, "Update Transaction");
    throw error;
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  try {
    await API.delete(`/transactions/${id}/`);
  } catch (error) {
    handleError(error, "Delete Transaction");
    throw error;
  }
}

/**
 * Get transaction statistics
 */
export async function fetchTransactionStatistics(): Promise<any> {
  try {
    const { data } = await API.get("/transactions/statistics/");
    return data;
  } catch (error) {
    console.error("Error fetching transaction statistics:", error);
    throw error;
  }
}
/**
 * Get transactions by account type
 */
export async function fetchTransactionsByAccountType(): Promise<any[]> {
  try {
    const { data } = await API.get("/transactions/by_account_type/");
    return data;
  } catch (error) {
    console.error("Error fetching transactions by account type:", error);
    throw error;
  }
}
/**
 * Get transactions by property type
 */
export async function fetchTransactionsByPropertyType(): Promise<any[]> {
  try {
    const { data } = await API.get("/transactions/by_property_type/");
    return data;
  } catch (error) {
    console.error("Error fetching transactions by property type:", error);
    throw error;
  }
}

/**
 * Get transactions by region
 */
export async function fetchTransactionsByRegion(): Promise<any[]> {
  try {
    const { data } = await API.get("/transactions/by_region/");
    return data;
  } catch (error) {
    console.error("Error fetching transactions by region:", error);
    throw error;
  }
}

// ============ Visitor Tracking ============
export async function recordVisitorVisit(): Promise<any> {
  try {
    const { data } = await API.post("/visitors/record_visit/", {});
    return data;
  } catch (error) {
    console.error("Error recording visitor visit:", error);
    // لا نرفع الخطأ لأن هذا ليس حرجاً
    return null;
  }
}

export async function getVisitorsCount(): Promise<any> {
  try {
    const { data } = await API.get("/visitors/total_count/");
    return data;
  } catch (error) {
    console.error("Error fetching visitors count:", error);
    throw error;
  }
}

export async function getVisitorsToday(): Promise<any> {
  try {
    const { data } = await API.get("/visitors/today_count/");
    return data;
  } catch (error) {
    console.error("Error fetching today visitors count:", error);
    throw error;
  }
}

export async function getVisitorsDailyStats(days = 30): Promise<any> {
  try {
    const { data } = await API.get(`/visitors/daily_stats/?days=${days}`);
    return data;
  } catch (error) {
    console.error("Error fetching daily visitor stats:", error);
    throw error;
  }
}

export async function getDeviceStats(): Promise<any> {
  try {
    const { data } = await API.get("/analytics/device_stats/");
    return data;
  } catch (error) {
    console.error("Error fetching device stats:", error);
    throw error;
  }
}
// ============ Notifications ============
export async function fetchNotifications(page = 1, pageSize = 20, filters?: Record<string, unknown>) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    // إضافة الفلاتر إذا وجدت
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const { data } = await API.get(`/notifications/?${params.toString()}`);
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function fetchUnreadNotifications() {
  try {
    const { data } = await API.get("/notifications/?is_read=false");
    return data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
}

export async function fetchRecentNotifications(limit = 10) {
  try {
    const { data } = await API.get(`/notifications/recent/?page_size=${limit}`);
    return data;
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    throw error;
  }
}

export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const { data } = await API.get("/notifications/unread_count/");
    return data.unread_count || 0;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<any> {
  try {
    const { data } = await API.post(`/notifications/${notificationId}/mark_as_read/`);
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<any> {
  try {
    const { data } = await API.post("/notifications/mark_all_as_read/");
    return data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await API.delete(`/notifications/${notificationId}/`);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

export async function clearAllNotifications(): Promise<any> {
  try {
    const { data } = await API.delete("/notifications/clear_all/");
    return data;
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    throw error;
  }
}