export const API_URL = import.meta.env.VITE_API_BASE_URL || "https://abdo238923.pythonanywhere.com/api";
export const API_BASE_URL = API_URL; // For backward compatibility

export const API_ENDPOINTS = {
  properties: `${API_URL}/listings/properties/`,
  areas: `${API_URL}/listings/areas/`,
};

// Connected to PythonAnywhere backend
