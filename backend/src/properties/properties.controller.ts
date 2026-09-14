import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { PropertiesService } from './properties.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RoleGuard } from '../auth/guards/role.guard.js';
import { Roles } from '../auth/roles.decorator.js';

export class CreatePropertyDto {
  title!: string;
  description!: string;
  location!: string;
  price!: number;
  images!: string[];
}

export class UpdatePropertyDto {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  images?: string[];
}

export class ContactOwnerDto {
  message!: string;
}

@Controller('properties')
export class PropertiesController {
  constructor(
    private propertiesService: PropertiesService,
  ) {}

  // ============================================================
  // PUBLIC: GET PROPERTIES
  // ============================================================

  @Get()
  async getProperties(@Query() query: any) {
    return this.propertiesService.getProperties({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      location: query.location,
      minPrice: query.minPrice
        ? parseFloat(query.minPrice)
        : undefined,
      maxPrice: query.maxPrice
        ? parseFloat(query.maxPrice)
        : undefined,
      status: query.status,
    });
  }

  // ============================================================
  // OWNER: GET OWNER PROPERTIES
  // ============================================================

  @Get('owner/:ownerId')
  async getOwnerProperties(
    @Param('ownerId') ownerId: string,
    @Query() query: any,
  ) {
    return this.propertiesService.getOwnerProperties(
      ownerId,
      parseInt(query.page) || 1,
      parseInt(query.limit) || 10,
    );
  }

  // ============================================================
  // ADMIN: GET ALL PROPERTIES
  // ============================================================

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  async getAdminProperties(@Query() query: any) {
    return this.propertiesService.getAdminProperties({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      location: query.location,
      minPrice: query.minPrice
        ? parseFloat(query.minPrice)
        : undefined,
      maxPrice: query.maxPrice
        ? parseFloat(query.maxPrice)
        : undefined,
      status: query.status,
    });
  }

  // ============================================================
  // ADMIN: GET SYSTEM METRICS
  // ============================================================

  @Get('admin/metrics')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  async getAdminMetrics() {
    return this.propertiesService.getAdminMetrics();
  }

  // ============================================================
  // ADMIN: DISABLE PROPERTY
  // ============================================================

  @Patch('admin/:id/disable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  async disableProperty(@Param('id') id: string) {
    return this.propertiesService.disableProperty(id);
  }

  // ============================================================
  // PUBLIC: GET SINGLE PROPERTY
  // ============================================================

  @Get(':id')
  async getProperty(@Param('id') id: string) {
    return this.propertiesService.getProperty(id);
  }

  // ============================================================
  // OWNER / ADMIN: CREATE PROPERTY
  // ============================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @Request() req: any,
  ) {
    return this.propertiesService.createProperty(
      req.user.sub,
      createPropertyDto,
    );
  }

  // ============================================================
  // REGULAR USER: CONTACT PROPERTY OWNER
  // ============================================================

  @Post(':id/contact')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('regular_user')
  async contactOwner(
    @Param('id') id: string,
    @Body() contactOwnerDto: ContactOwnerDto,
    @Request() req: any,
  ) {
    return this.propertiesService.contactOwner(
      id,
      req.user.sub,
      contactOwnerDto.message,
    );
  }

  // ============================================================
  // OWNER / ADMIN: UPDATE PROPERTY
  // ============================================================

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Request() req: any,
  ) {
    return this.propertiesService.updateProperty(
      id,
      req.user.sub,
      updatePropertyDto,
    );
  }

  // ============================================================
  // OWNER / ADMIN: PUBLISH PROPERTY
  // ============================================================

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async publishProperty(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.propertiesService.publishProperty(
      id,
      req.user.sub,
    );
  }

  // ============================================================
  // OWNER / ADMIN: SOFT DELETE OWN PROPERTY
  // ============================================================

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async deleteProperty(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.propertiesService.deleteProperty(
      id,
      req.user.sub,
    );
  }
}