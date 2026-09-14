import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export interface CreatePropertyDto {
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
}

export class UploadedFileDto {
  fieldname!: string;
  originalname!: string;
  encoding!: string;
  mimetype!: string;
  size!: number;
  buffer!: Buffer;
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

export interface AdminPropertyListQuery {
  page?: number;
  limit?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

@Injectable()
export class PropertiesService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
    );
  }

  // ============================================================
  // CREATE PROPERTY
  // ============================================================

  async createProperty(
    ownerId: string,
    createPropertyDto: CreatePropertyDto,
  ) {
    const {
      title,
      description,
      location,
      price,
      images,
    } = createPropertyDto;

    if (images && images.length > 0) {
      this.validateImageUrls(images);
    }

    const { data: property, error } = await this.supabase
      .from('properties')
      .insert([
        {
          owner_id: ownerId,
          title,
          description,
          location,
          price,
          images: JSON.stringify(images || []),
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

  // ============================================================
  // UPDATE PROPERTY
  // ============================================================

  async updateProperty(
    propertyId: string,
    ownerId: string,
    updatePropertyDto: UpdatePropertyDto,
  ) {
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
      throw new ForbiddenException(
        'You can only update your own properties',
      );
    }

    // Published properties cannot be edited.
    if (property.status === 'published') {
      throw new BadRequestException(
        'Cannot update published properties',
      );
    }

    const updateData: any = {
      ...updatePropertyDto,
      updated_at: new Date().toISOString(),
    };

    if (updatePropertyDto.images) {
      if (updatePropertyDto.images.length > 0) {
        this.validateImageUrls(updatePropertyDto.images);
      }
      updateData.images = JSON.stringify(updatePropertyDto.images);
    }

    const { data: updatedProperty, error } = await this.supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        'Failed to update property',
      );
    }

    return this.formatProperty(updatedProperty);
  }

  // ============================================================
  // PUBLISH PROPERTY
  // ============================================================

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
      throw new ForbiddenException(
        'You can only publish your own properties',
      );
    }

    if (property.status !== 'draft') {
      throw new BadRequestException(
        'Only draft properties can be published',
      );
    }

    // Validate required fields before publishing.
    if (
      !property.title?.trim() ||
      !property.description?.trim() ||
      !property.location?.trim() ||
      property.price === null ||
      property.price === undefined ||
      property.price <= 0
    ) {
      throw new BadRequestException(
        'Property must have a valid title, description, location, and price',
      );
    }

    // A published property must contain images.
    const images = this.parseImages(property.images);

    if (images.length === 0) {
      throw new BadRequestException(
        'Property must have at least one image before publishing',
      );
    }

    const { data: updatedProperty, error } = await this.supabase
      .from('properties')
      .update({
        status: 'published',
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId)
      .eq('status', 'draft')
      .is('deleted_at', null)
      .select()
      .single();

    if (error || !updatedProperty) {
      throw new BadRequestException(
        'Failed to publish property',
      );
    }

    return this.formatProperty(updatedProperty);
  }

  // ============================================================
  // GET SINGLE PROPERTY
  // ============================================================

  async getProperty(
    propertyId: string,
    includeDeleted = false,
  ) {
    let query = this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId);

    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    const { data: property, error } = await query.single();

    if (error || !property) {
      throw new NotFoundException('Property not found');
    }

    return this.formatProperty(property);
  }

  // ============================================================
  // GET PUBLIC PROPERTIES
  // ============================================================

  async getProperties(listQuery: PropertyListQuery) {
    const {
      page = 1,
      limit = 10,
      location,
      minPrice,
      maxPrice,
      status = 'published',
    } = listQuery;

    const offset = (page - 1) * limit;

    let query = this.supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    if (location) {
      query = query.ilike(
        'location',
        `%${location}%`,
      );
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    const {
      data: properties,
      error,
      count,
    } = await query
      .order('created_at', { ascending: false })
      .range(
        offset,
        offset + limit - 1,
      );

    if (error) {
      throw new BadRequestException(
        'Failed to fetch properties',
      );
    }

    return {
      data: (properties || []).map(
        (property: any) =>
          this.formatProperty(property),
      ),
      total: count || 0,
      page,
      limit,
      pages: Math.ceil(
        (count || 0) / limit,
      ),
    };
  }

  // ============================================================
  // GET OWNER PROPERTIES
  // ============================================================

  async getOwnerProperties(
    ownerId: string,
    page = 1,
    limit = 10,
  ) {
    const offset = (page - 1) * limit;

    const {
      data: properties,
      error,
      count,
    } = await this.supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('owner_id', ownerId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false,
      })
      .range(
        offset,
        offset + limit - 1,
      );

    if (error) {
      throw new BadRequestException(
        'Failed to fetch properties',
      );
    }

    return {
      data: (properties || []).map(
        (property: any) =>
          this.formatProperty(property),
      ),
      total: count || 0,
      page,
      limit,
      pages: Math.ceil(
        (count || 0) / limit,
      ),
    };
  }

  // ============================================================
  // ADMIN: GET ALL PROPERTIES
  // ============================================================

  async getAdminProperties(
    listQuery: AdminPropertyListQuery,
  ) {
    const {
      page = 1,
      limit = 10,
      location,
      minPrice,
      maxPrice,
      status,
    } = listQuery;

    const offset = (page - 1) * limit;

    let query = this.supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    // Unlike the public endpoint, Admin can see
    // draft, published, and archived properties.
    if (status) {
      query = query.eq('status', status);
    }

    if (location) {
      query = query.ilike(
        'location',
        `%${location}%`,
      );
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    const {
      data: properties,
      error,
      count,
    } = await query
      .order('created_at', {
        ascending: false,
      })
      .range(
        offset,
        offset + limit - 1,
      );

    if (error) {
      throw new BadRequestException(
        'Failed to fetch admin properties',
      );
    }

    return {
      data: (properties || []).map(
        (property: any) =>
          this.formatProperty(property),
      ),
      total: count || 0,
      page,
      limit,
      pages: Math.ceil(
        (count || 0) / limit,
      ),
    };
  }

  // ============================================================
  // ADMIN: GET SYSTEM METRICS
  // ============================================================

  async getAdminMetrics() {
    const {
      count: total,
      error: totalError,
    } = await this.supabase
      .from('properties')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .is('deleted_at', null);

    if (totalError) {
      throw new BadRequestException(
        'Failed to fetch total property metrics',
      );
    }

    const {
      count: published,
      error: publishedError,
    } = await this.supabase
      .from('properties')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'published')
      .is('deleted_at', null);

    if (publishedError) {
      throw new BadRequestException(
        'Failed to fetch published property metrics',
      );
    }

    const {
      count: drafts,
      error: draftsError,
    } = await this.supabase
      .from('properties')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'draft')
      .is('deleted_at', null);

    if (draftsError) {
      throw new BadRequestException(
        'Failed to fetch draft property metrics',
      );
    }

    const {
      count: archived,
      error: archivedError,
    } = await this.supabase
      .from('properties')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'archived')
      .is('deleted_at', null);

    if (archivedError) {
      throw new BadRequestException(
        'Failed to fetch archived property metrics',
      );
    }

    return {
      total: total || 0,
      published: published || 0,
      drafts: drafts || 0,
      archived: archived || 0,
    };
  }

  // ============================================================
  // ADMIN: DISABLE PROPERTY
  // ============================================================

  async disableProperty(propertyId: string) {
    const {
      data: property,
      error: fetchError,
    } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !property) {
      throw new NotFoundException(
        'Property not found',
      );
    }

    if (property.status === 'archived') {
      throw new BadRequestException(
        'Property is already archived',
      );
    }

    const {
      data: updatedProperty,
      error,
    } = await this.supabase
      .from('properties')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error || !updatedProperty) {
      throw new BadRequestException(
        'Failed to disable property',
      );
    }

    return this.formatProperty(
      updatedProperty,
    );
  }

  // ============================================================
  // OWNER: SOFT DELETE PROPERTY
  // ============================================================

  async deleteProperty(
    propertyId: string,
    ownerId: string,
  ) {
    const {
      data: property,
      error: fetchError,
    } = await this.supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !property) {
      throw new NotFoundException(
        'Property not found',
      );
    }

    if (property.owner_id !== ownerId) {
      throw new ForbiddenException(
        'You can only delete your own properties',
      );
    }

    const { error } = await this.supabase
      .from('properties')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', propertyId);

    if (error) {
      throw new BadRequestException(
        'Failed to delete property',
      );
    }

    return {
      success: true,
    };
  }
  // ============================================================
// REGULAR USER: CONTACT PROPERTY OWNER
// ============================================================

async contactOwner(
  propertyId: string,
  senderId: string,
  message: string,
) {
  if (!message?.trim()) {
    throw new BadRequestException(
      'Message cannot be empty',
    );
  }

  const { data: property, error: propertyError } =
    await this.supabase
      .from('properties')
      .select('id, owner_id, status')
      .eq('id', propertyId)
      .is('deleted_at', null)
      .single();

  if (propertyError || !property) {
    throw new NotFoundException(
      'Property not found',
    );
  }

  if (property.status !== 'published') {
    throw new BadRequestException(
      'You can only contact the owner of a published property',
    );
  }

  if (property.owner_id === senderId) {
    throw new BadRequestException(
      'You cannot contact yourself',
    );
  }

  const { data: contact, error } =
    await this.supabase
      .from('property_contacts')
      .insert([
        {
          property_id: propertyId,
          sender_id: senderId,
          owner_id: property.owner_id,
          message: message.trim(),
        },
      ])
      .select()
      .single();

  if (error) {
    console.error(
      'Contact owner error:',
      error,
    );

    throw new BadRequestException(
      'Failed to send message to property owner',
    );
  }

  return {
    success: true,
    message: 'Message sent to property owner',
    contact: {
      id: contact.id,
      propertyId: contact.property_id,
      senderId: contact.sender_id,
      ownerId: contact.owner_id,
      message: contact.message,
      createdAt: contact.created_at,
    },
  };
}

  // ============================================================
  // HELPERS
  // ============================================================

  private parseImages(images: any): string[] {
    if (!images) {
      return [];
    }

    if (Array.isArray(images)) {
      return images;
    }

    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    }

    return [];
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
      images: this.parseImages(
        property.images,
      ),
      createdAt: property.created_at,
      updatedAt: property.updated_at,
      deletedAt: property.deleted_at,
    };
  }

  // ============================================================
  // IMAGE VALIDATION & CLOUD STORAGE UPLOAD
  // ============================================================

  validateImageUrls(images: string[]): void {
    if (!Array.isArray(images)) {
      throw new BadRequestException('Images must be provided as an array of URLs');
    }

    const maxImages = 10;
    if (images.length > maxImages) {
      throw new BadRequestException(`Maximum of ${maxImages} images allowed per property`);
    }

    for (const url of images) {
      if (typeof url !== 'string' || !url.trim()) {
        throw new BadRequestException('Image URLs must be non-empty strings');
      }

      const trimmed = url.trim();
      let parsed: URL;
      try {
        parsed = new URL(trimmed);
      } catch {
        throw new BadRequestException(`Invalid image URL format: "${trimmed}"`);
      }

      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new BadRequestException(`Invalid image URL protocol: "${trimmed}". Only HTTP and HTTPS URLs are permitted.`);
      }
    }
  }

  async uploadImage(file: UploadedFileDto, ownerId: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const maxFileSize = parseInt(this.configService.get<string>('MAX_IMAGE_SIZE') || '5242880', 10);
    if (file.size > maxFileSize) {
      const maxMb = (maxFileSize / (1024 * 1024)).toFixed(0);
      throw new BadRequestException(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed limit of ${maxMb}MB`);
    }

    const allowedTypes = (this.configService.get<string>('ALLOWED_IMAGE_TYPES') || 'image/jpeg,image/png,image/webp')
      .split(',')
      .map((t) => t.trim().toLowerCase());

    if (!allowedTypes.includes(file.mimetype.toLowerCase())) {
      throw new BadRequestException(
        `Invalid file type (${file.mimetype}). Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    const fileExt = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${ownerId}/${sanitizedFileName}`;

    const { error } = await this.supabase.storage
      .from('property-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Cloud storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async uploadImages(files: UploadedFileDto[], ownerId: string): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }

    if (files.length > 10) {
      throw new BadRequestException('Cannot upload more than 10 images at once');
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await this.uploadImage(file, ownerId);
      urls.push(url);
    }
    return urls;
  }
}

