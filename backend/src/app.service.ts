import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Visita el enlace al <a href="http://localhost:4000/api-docs">Swagger</a>  ';
  }
}
