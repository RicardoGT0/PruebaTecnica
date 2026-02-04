import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './entities/provider.entity';
import { Document } from '../document/entities/document.entity';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [SequelizeModule.forFeature([Provider, Document])],
})
export class ProvidersModule {}
