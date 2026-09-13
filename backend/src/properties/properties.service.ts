import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export interface CreatePropertyDto {
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
}

export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  images?: string[];
  updated_at?: string;
}

export interface PropertyListQuery {
  page?: number;
  limit?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

@Injectable()
export class PropertiesService {
  private supabase: any;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
    );
  }

  async createProperty(ownerId: string, createPropertyDto: CreatePropertyDto) {
    const { title, description, location, price, images } = createPropertyDto;

    const { data: property, error } = await this.supabase
      .from('properties')
      .insert([
        {
          owner_id: ownerId,
          title,
          description,
          location,
          price,
          images: JSON.stringify(images),
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create property');
    }

    return this.formatProperty(property);
  }

  async updateProperty(propertyId: string, ownerId: string, updatePropertyDto: UpdatePropertyDto) {
    // Check if property exists and belongs to owner
    const { data: property, error: fetchError } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner_id !== ownerId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    // Cannot update published properties
    if (property.status === 'published') {
      throw new BadRequestException('Cannot update published properties');
    }

    const updateData: any = { ...updatePropertyDto };
    if (updatePropertyDto.images) {
      updateData.images = JSON.stringify(updatePropertyDto.images);
    }
    updateData.updated_at = new Date().toISOString();

    const { data: updatedProperty, error } = await this.supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to update property');
    }

    return this.formatProperty(updatedProperty);
  }

  async publishProperty(propertyId: string, ownerId: string) {
    const { data: property, error: fetchError } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner_id !== ownerId) {
      throw new ForbiddenException('You can only publish your own properties');
    }

    if (property.status !== 'draft') {
      throw new BadRequestException('Only draft properties can be published');
    }

    // Validate property has required fields
    if (!property.title || !property.description || !property.location || property.price === null) {
      throw new BadRequestException('Property must have title, description, location, and price');
    }

    const { data: updatedProperty, error } = await this.supabase
      .from('properties')
      .update({
        status: 'published',
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to publish property');
    }

    return this.formatProperty(updatedProperty);
  }

  async getProperty(propertyId: string, includeDeleted = false) {
    let query = this.supabase.from('properties').select('*').eq('id', propertyId);

    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    const { data: property, error } = await query.single();

    if (error || !property) {
      throw new NotFoundException('Property not found');
    }

    return this.formatProperty(property);
  }

  async getProperties(listQuery: PropertyListQuery) {
    const { page = 1, limit = 10, location, minPrice, maxPrice, status = 'published' } = listQuery;
    const offset = (page - 1) * limit;

    let query = this.supabase.from('properties').select('*', { count: 'exact' }).is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    const { data: properties, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestException('Failed to fetch properties');
    }

    return {
      data: (properties || []).map((p: any) => this.formatProperty(p)),
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    };
  }

  async getOwnerProperties(ownerId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { data: properties, error, count } = await this.supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('owner_id', ownerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestException('Failed to fetch properties');
    }

    return {
      data: (properties || []).map((p: any) => this.formatProperty(p)),
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    };
  }

  async deleteProperty(propertyId: string, ownerId: string) {
    const { data: property, error: fetchError } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !property) {
      throw new NotFoundException('Property not found');
    }

    if (property.owner_id !== ownerId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    const { error } = await this.supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', propertyId);

    if (error) {
      throw new BadRequestException('Failed to delete property');
    }

    return { success: true };
  }

  private formatProperty(property: any) {
    return {
      id: property.id,
      ownerId: property.owner_id,
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      status: property.status,
      images: typeof property.images === 'string' ? JSON.parse(property.images) : property.images || [],
      createdAt: property.created_at,
      updatedAt: property.updated_at,
      deletedAt: property.deleted_at,
    };
  }
}
