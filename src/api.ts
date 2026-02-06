import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://abdo238923.pythonanywhere.com/api";

// Axios instance
const API = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default API;

// ============ Authentication ============
export async function changePassword(data: {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}) {
  try {
    const response = await API.post("/users/auth/change-password/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error changing password:", error);
    throw error.response?.data || error;
  }
}

export async function updateProfile(profileData: any) {
  try {
    const response = await API.put("/users/auth/me/", profileData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error.response?.data || error;
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

export async function createProperty(propertyData: any) {
  try {
    const { data } = await API.post("/properties/", propertyData);
    return data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

export async function updateProperty(id: string, propertyData: any) {
  try {
    const { data } = await API.put(`/properties/${id}/`, propertyData);
    return data;
  } catch (error) {
    console.error("Error updating property:", error);
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
export async function searchProperties(filters: any) {
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
