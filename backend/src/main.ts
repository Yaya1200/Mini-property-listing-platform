import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(cors({ origin: configService.get('CORS_ORIGIN'), credentials: true }));

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Application running on port ${port}`);
  });
}

await bootstrap();
