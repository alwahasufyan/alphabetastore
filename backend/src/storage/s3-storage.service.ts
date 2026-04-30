import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { StorageService, UploadFileOptions } from './local-storage.service';

@Injectable()
export class S3StorageService extends StorageService implements OnModuleInit {
  private readonly logger = new Logger(S3StorageService.name);
  private client!: S3Client;
  private bucket!: string;
  private publicBaseUrl!: string;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  onModuleInit() {
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const region = this.configService.getOrThrow<string>('S3_REGION');
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const publicBaseUrl = this.configService.get<string>('S3_PUBLIC_BASE_URL');

    this.client = new S3Client({
      region,
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    });

    this.publicBaseUrl =
      publicBaseUrl?.replace(/\/$/, '') ??
      `https://${this.bucket}.s3.${region}.amazonaws.com`;
  }

  async saveFile(buffer: Buffer, options: UploadFileOptions): Promise<string> {
    const extension = extname(options.originalname).toLowerCase();
    const key = `${options.subdirectory}/${randomUUID()}${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: this.resolveContentType(extension),
      }),
    );

    return `${this.publicBaseUrl}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const prefix = `${this.publicBaseUrl}/`;

    if (!fileUrl.startsWith(prefix)) {
      return;
    }

    const key = fileUrl.slice(prefix.length);

    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      this.logger.warn(`Failed to delete S3 object ${key}: ${(error as Error).message ?? error}`);
      throw error;
    }
  }

  private resolveContentType(extension: string): string {
    const types: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
    };

    return types[extension] ?? 'application/octet-stream';
  }
}
