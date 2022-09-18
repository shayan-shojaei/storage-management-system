import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as mongoSanitize from 'express-mongo-sanitize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cors
  app.enableCors();

  // Helmet
  app.use(helmet());

  // Mongo Sanitize
  app.use(mongoSanitize());

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Transformation Interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Restaurant Management System')
    .setVersion('0.0.1')
    .setDescription('The API for the RMS')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
