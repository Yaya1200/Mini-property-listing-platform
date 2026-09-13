import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get supabaseUrl(): string {
    return this.configService.get<string>('SUPABASE_URL') || '';
  }

  get supabaseKey(): string {
    return this.configService.get<string>('SUPABASE_KEY') || '';
  }

  get supabaseServiceKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_KEY') || '';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'dev-secret';
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION') || '7d';
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  }

  get maxImageSize(): number {
    return this.configService.get<number>('MAX_IMAGE_SIZE') || 5242880; // 5MB
  }

  get allowedImageTypes(): string[] {
    const types = this.configService.get<string>('ALLOWED_IMAGE_TYPES');
    return types ? types.split(',') : ['image/jpeg', 'image/png', 'image/webp'];
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
