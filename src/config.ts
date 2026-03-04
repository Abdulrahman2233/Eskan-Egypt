export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const API_URL = API_BASE; // Alias for backward compatibility
export const API_BASE_URL = API_BASE; // Alias for backward compatibility
export const BACKEND_URL = API_BASE.replace('/api', '');

export const API_ENDPOINTS = {
  properties: `${API_BASE}/listings/properties/`,
  areas: `${API_BASE}/listings/areas/`,
};

// Connected to PythonAnywhere backend
