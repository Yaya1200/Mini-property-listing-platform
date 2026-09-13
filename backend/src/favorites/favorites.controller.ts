import { Controller, Post, Delete, Get, Param, UseGuards, Request, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(':propertyId')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(@Param('propertyId') propertyId: string, @Request() req: any) {
    return this.favoritesService.addFavorite(req.user.sub, propertyId);
  }

  @Delete(':propertyId')
  async removeFavorite(@Param('propertyId') propertyId: string, @Request() req: any) {
    return this.favoritesService.removeFavorite(req.user.sub, propertyId);
  }

  @Get()
  async getUserFavorites(@Request() req: any, @Query() query: any) {
    return this.favoritesService.getUserFavorites(req.user.sub, parseInt(query.page) || 1, parseInt(query.limit) || 10);
  }

  @Get(':propertyId/check')
  async checkFavorite(@Param('propertyId') propertyId: string, @Request() req: any) {
    return this.favoritesService.isFavorite(req.user.sub, propertyId);
  }
}
