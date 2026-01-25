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
