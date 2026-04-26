import { Module } from '@nestjs/common';

import { RolesGuard } from '../common/guards/roles.guard';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, RolesGuard],
})
export class ServicesModule {}
