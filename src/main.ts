import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Restaurant Management System')
    .setVersion('0.0.1')
    .setDescription('The API for the RMS')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  await app.listen(5000);
}
bootstrap();
