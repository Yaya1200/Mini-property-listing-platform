import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FavoritesService {
  private supabase: any;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
    );
  }

  async addFavorite(userId: string, propertyId: string) {
    // Verify property exists
    const { data: property } = await this.supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const { data: _favorite, error } = await this.supabase
      .from('favorites')
      .insert([{ user_id: userId, property_id: propertyId }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - already favorited
        return { success: true, alreadyFavorited: true };
      }
      throw error;
    }

    return { success: true, alreadyFavorited: false };
  }

  async removeFavorite(userId: string, propertyId: string) {
    const { error } = await this.supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async getUserFavorites(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { data: favorites, error, count } = await this.supabase
      .from('favorites')
      .select('*, properties(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      data: favorites || [],
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    };
  }

  async isFavorite(userId: string, propertyId: string) {
    const { data: favorite } = await this.supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();

    return { isFavorite: !!favorite };
  }
}
