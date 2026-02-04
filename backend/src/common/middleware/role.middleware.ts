import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const role = req.headers['x-user-role'] as string | undefined;

    req.user = {
      role: role ?? 'guest',
    };

    next();
  }
}
