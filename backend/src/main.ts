import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const uploadsPath = join(process.cwd(), 'uploads');

  app.setGlobalPrefix(configService.get<string>('API_PREFIX', 'api/v1'));
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const rawOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS', '');
  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';
  const corsOrigins =
    allowedOrigins.length
      ? allowedOrigins
      : isDevelopment
        ? ['http://localhost:3000']
        : false;

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  if (isDevelopment) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Alphabeta Store API')
      .setDescription('REST API for the Alphabeta Store platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
}

bootstrap();