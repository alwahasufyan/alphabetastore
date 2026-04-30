import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';

export type UploadFileOptions = {
  /** Subdirectory within the uploads root, e.g. 'products' or 'payment-receipts' */
  subdirectory: string;
  /** Original filename – used only for extension extraction */
  originalname: string;
};

/**
 * Abstract storage service.
 *
 * Concrete implementations (Local / S3) are swapped at runtime via
 * the `STORAGE_DRIVER` environment variable.  Consumers only depend
 * on this class so the driver can change without touching business logic.
 */
export abstract class StorageService {
  /**
   * Save a file and return the publicly accessible URL.
   */
  abstract saveFile(buffer: Buffer, options: UploadFileOptions): Promise<string>;

  /**
   * Delete a previously saved file by its URL.
   * Implementations must be idempotent – deleting a non-existent file
   * should not throw.
   */
  abstract deleteFile(fileUrl: string): Promise<void>;
}

// ─── Local implementation ────────────────────────────────────────────────────

@Injectable()
export class LocalStorageService extends StorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadsRoot = join(process.cwd(), 'uploads');

  async saveFile(buffer: Buffer, options: UploadFileOptions): Promise<string> {
    const dir = join(this.uploadsRoot, options.subdirectory);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const extension = extname(options.originalname).toLowerCase();
    const filename = `${randomUUID()}${extension}`;
    const filePath = join(dir, filename);

    await writeFile(filePath, buffer);

    return `/uploads/${options.subdirectory}/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl.startsWith('/uploads/')) {
      return;
    }

    const segments = fileUrl.replace(/^\//, '').split('/');
    const filePath = join(process.cwd(), ...segments);

    try {
      await unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        this.logger.warn(`Failed to delete local file: ${filePath}`);
        throw error;
      }
    }
  }
}
