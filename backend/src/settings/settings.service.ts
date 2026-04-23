import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.systemSetting.findMany({
      orderBy: {
        key: 'asc',
      },
    });

    const result: Record<string, string> = {};

    for (const setting of settings as Array<{ key: string; value: string }>) {
      result[setting.key] = setting.value;
    }

    return result;
  }

  async findGrouped() {
    const settings = await this.findAll();

    return {
      general: {
        site_name: settings.site_name ?? 'Alphabeta',
        theme: settings.theme ?? 'default',
        primary_color: settings.primary_color ?? '#1976d2',
        enable_whatsapp: settings.enable_whatsapp ?? 'true',
      },
      all: settings,
    };
  }

  async updateSetting(updateSystemSettingDto: UpdateSystemSettingDto) {
    const { key, value } = updateSystemSettingDto;

    const updated = await this.prisma.systemSetting.upsert({
      where: {
        key,
      },
      update: {
        value,
      },
      create: {
        key,
        value,
      },
    });

    return {
      key: updated.key,
      value: updated.value,
    };
  }
}
