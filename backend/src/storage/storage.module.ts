import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LocalStorageService, StorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    LocalStorageService,
    S3StorageService,
    {
      provide: StorageService,
      useFactory: (
        configService: ConfigService,
        local: LocalStorageService,
        s3: S3StorageService,
      ): StorageService =>
        configService.get<string>('STORAGE_DRIVER') === 's3' ? s3 : local,
      inject: [ConfigService, LocalStorageService, S3StorageService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
