import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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
