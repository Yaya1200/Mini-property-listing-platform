import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { PropertiesService } from '../properties/properties.service.js';

@Injectable()
export class AdminService {
  private supabase: any;

  constructor(
    private configService: ConfigService,
    private propertiesService: PropertiesService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
    );
  }

  // Admin can view all properties regardless of status
  async getAllProperties() {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*')
      .is('deleted_at', null);
    if (error) {
      throw new BadRequestException('Failed to fetch properties');
    }
    return data.map((p: any) => this.propertiesService['formatProperty'](p));
  }

  // Soft‑delete a property (admin only)
  async disableProperty(propertyId: string) {
    // Verify property exists
    const { data: property, error: fetchError } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    if (fetchError || !property) {
      throw new NotFoundException('Property not found');
    }
    const { error } = await this.supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', propertyId);
    if (error) {
      throw new BadRequestException('Failed to disable property');
    }
    return { success: true };
  }

  // Simple system metrics for admin dashboard
  async getMetrics() {
    const [{ count: usersCount }, { count: propertiesCount }, { count: favoritesCount }] = await Promise.all([
      this.supabase.from('users').select('id', { count: 'exact' }).limit(0),
      this.supabase.from('properties').select('id', { count: 'exact' }).limit(0),
      this.supabase.from('favorites').select('id', { count: 'exact' }).limit(0),
    ]);
    return {
      users: usersCount ?? 0,
      properties: propertiesCount ?? 0,
      favorites: favoritesCount ?? 0,
    };
  }
  // Create a new admin user (protected endpoint)
  async createAdmin(dto: any) {
    const { email, password, name } = dto;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: user, error } = await this.supabase
      .from('users')
      .insert([
        {
          email,
          name,
          password_hash: hashedPassword,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    if (error) {
      throw new BadRequestException('Failed to create admin');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
