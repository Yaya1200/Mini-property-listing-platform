import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RoleGuard } from '../auth/guards/role.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../types/index.js';
import { CreateAdminDto } from './create-admin.dto.js';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get('properties')
  async getAllProperties() {
    return this.adminService.getAllProperties();
  }

  @Patch('properties/:id/disable')
  async disableProperty(@Param('id') id: string) {
    return this.adminService.disableProperty(id);
  }

  @Get('metrics')
  async getMetrics() {
    return this.adminService.getMetrics();
  }
}
