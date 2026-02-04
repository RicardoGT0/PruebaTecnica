import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Proveedores')
    .setDescription('Documentación del MVP de Proveedores')
    .setVersion('1.0')
    .addBearerAuth() // opcional si luego usas JWT real
    .addApiKey(
      { type: 'apiKey', name: 'x-user-role', in: 'header' },
      'role-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
