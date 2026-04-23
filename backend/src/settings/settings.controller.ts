import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../prisma/prisma-client';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import { SettingsService } from './settings.service';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('settings')
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('settings/grouped')
  findGrouped() {
    return this.settingsService.findGrouped();
  }

  @Patch('admin/settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateSetting(@Body() updateSystemSettingDto: UpdateSystemSettingDto) {
    return this.settingsService.updateSetting(updateSystemSettingDto);
  }
}
