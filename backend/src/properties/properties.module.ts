import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import { PropertiesController } from './properties.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
