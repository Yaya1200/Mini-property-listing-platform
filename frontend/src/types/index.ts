export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'property_owner' | 'regular_user';
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

export interface FavoritesResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
