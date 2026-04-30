import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from '../prisma/prisma.service';

type ComponentStatus = 'ok' | 'error';

type HealthResult = {
  status: 'ok' | 'degraded';
  timestamp: string;
  components: {
    database: ComponentStatus;
    cache: ComponentStatus;
  };
};

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache | null,
  ) {}

  async check(): Promise<HealthResult> {
    const [dbStatus, cacheStatus] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
    ]);

    const allOk = dbStatus === 'ok' && cacheStatus === 'ok';

    return {
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      components: {
        database: dbStatus,
        cache: cacheStatus,
      },
    };
  }

  private async checkDatabase(): Promise<ComponentStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return 'ok';
    } catch (error) {
      this.logger.error('Database health check failed', error);

      return 'error';
    }
  }

  private async checkCache(): Promise<ComponentStatus> {
    if (!this.cacheManager) {
      return 'ok';
    }

    try {
      const testKey = '__health_check__';
      await this.cacheManager.set(testKey, 1, 5_000);
      await this.cacheManager.del(testKey);

      return 'ok';
    } catch (error) {
      this.logger.error('Cache health check failed', error);

      return 'error';
    }
  }
}
