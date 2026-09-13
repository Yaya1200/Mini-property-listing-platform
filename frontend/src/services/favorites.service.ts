import apiClient from '@/lib/api-client';
import { Property } from './properties.service';

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  properties?: Property;
}

export interface FavoritesResponse {
  data: Favorite[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const favoritesService = {
  async addFavorite(propertyId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
      `/favorites/${propertyId}`
    );
    return response.data;
  },

  async removeFavorite(propertyId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/favorites/${propertyId}`
    );
    return response.data;
  },

  async getUserFavorites(
    page = 1,
    limit = 10
  ): Promise<FavoritesResponse> {
    const response = await apiClient.get<FavoritesResponse>(
      `/favorites?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async isFavorite(propertyId: string): Promise<{ isFavorite: boolean }> {
    const response = await apiClient.get<{ isFavorite: boolean }>(
      `/favorites/${propertyId}/check`
    );
    return response.data;
  },
};
