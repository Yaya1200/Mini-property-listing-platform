// src/services/api.ts
"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Auth
export const login = (data: { email: string; password: string }) => api.post("/auth/login", data);
export const register = (data: {
  email: string;
  password: string;
  name: string;
  role: "admin" | "property_owner" | "regular_user";
  adminCode?: string;
}) => api.post("/auth/register", data);

// Admin
export const fetchAdminProperties = () => api.get("/admin/properties");
export const disableProperty = (id: string) => api.patch(`/admin/properties/${id}/disable`);
export const fetchMetrics = () => api.get("/admin/metrics");

// Owner
export const createProperty = (payload: any) => api.post("/owner/properties", payload);
export const updateProperty = (id: string, payload: any) => api.put(`/owner/properties/${id}`, payload);
export const publishProperty = (id: string) => api.post(`/owner/properties/${id}/publish`);
export const getOwnerProperties = () => api.get("/owner/properties");

// Favorites
export const fetchFavorites = () => api.get("/favorites");
export const addFavorite = (propertyId: string) => api.post("/favorites", { propertyId });
export const removeFavorite = (propertyId: string) => api.delete(`/favorites/${propertyId}`);

// Contact
export const contactOwner = (propertyId: string, message: string) =>
  api.post(`/properties/${propertyId}/contact`, { message });

export default api;
