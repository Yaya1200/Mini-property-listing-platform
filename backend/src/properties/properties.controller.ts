import {
  Controller,
  Get,
  Post,
  Put,
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
import { Roles } from '../auth/decorators/roles.decorator.js';

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

@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Get()
  async getProperties(@Query() query: any) {
    return this.propertiesService.getProperties({
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      location: query.location,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      status: query.status,
    });
  }

  @Get('owner/:ownerId')
  async getOwnerProperties(@Param('ownerId') ownerId: string, @Query() query: any) {
    return this.propertiesService.getOwnerProperties(ownerId, parseInt(query.page) || 1, parseInt(query.limit) || 10);
  }

  @Get(':id')
  async getProperty(@Param('id') id: string) {
    return this.propertiesService.getProperty(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async createProperty(@Body() createPropertyDto: CreatePropertyDto, @Request() req: any) {
    return this.propertiesService.createProperty(req.user.sub, createPropertyDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async updateProperty(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @Request() req: any) {
    return this.propertiesService.updateProperty(id, req.user.sub, updatePropertyDto);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async publishProperty(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.publishProperty(id, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('property_owner', 'admin')
  async deleteProperty(@Param('id') id: string, @Request() req: any) {
    return this.propertiesService.deleteProperty(id, req.user.sub);
  }
}
