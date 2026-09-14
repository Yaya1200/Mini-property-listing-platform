import apiClient from '@/lib/api-client';

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  images: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  images?: string[];
}

export interface PropertyListResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const propertiesService = {
  async getProperties(
    page = 1,
    limit = 10,
    location?: string,
    minPrice?: number,
    maxPrice?: number,
    status = 'published'
  ): Promise<PropertyListResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (location) params.append('location', location);
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    params.append('status', status);

    const response = await apiClient.get<PropertyListResponse>(
      `/properties?${params.toString()}`
    );
    return response.data;
  },

  async getProperty(id: string): Promise<Property> {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },

  async getOwnerProperties(
    ownerId: string,
    page = 1,
    limit = 10
  ): Promise<PropertyListResponse> {
    const response = await apiClient.get<PropertyListResponse>(
      `/properties/owner/${ownerId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async createProperty(data: CreatePropertyRequest): Promise<Property> {
    const response = await apiClient.post<Property>('/properties', data);
    return response.data;
  },

  async updateProperty(
    id: string,
    data: UpdatePropertyRequest
  ): Promise<Property> {
    const response = await apiClient.put<Property>(`/properties/${id}`, data);
    return response.data;
  },

  async publishProperty(id: string): Promise<Property> {
    const response = await apiClient.post<Property>(`/properties/${id}/publish`);
    return response.data;
  },

  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`/properties/${id}`);
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ url: string }>('/properties/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await apiClient.post<{ urls: string[] }>('/properties/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.urls;
  },
};
