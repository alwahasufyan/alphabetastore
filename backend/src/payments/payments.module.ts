import { Module } from '@nestjs/common';

import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StorageModule } from '../storage/storage.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [StorageModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, RolesGuard, OptionalJwtAuthGuard],
})
export class PaymentsModule {}