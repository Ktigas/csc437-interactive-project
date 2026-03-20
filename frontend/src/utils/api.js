const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  return authToken || localStorage.getItem("token");
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const authAPI = {
  register: (userData) => fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  })
};

export const reviewsAPI = {
  getAll: () => fetchWithAuth("/reviews"),
  getOne: (id) => fetchWithAuth(`/reviews/${id}`),
  create: (reviewData) => fetchWithAuth("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData)
  }),
  update: (id, reviewData) => fetchWithAuth(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData)
  }),
  delete: (id) => fetchWithAuth(`/reviews/${id}`, {
    method: "DELETE"
  }),
  getStats: () => fetchWithAuth("/reviews/stats")
};