import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtPayload } from '../auth/types/jwt-payload.type';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../prisma/prisma-client';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

type ServicesRequest = {
  user: JwtPayload;
};

@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('services')
  findAllServices() {
    return this.servicesService.findAllPublicServices();
  }

  @Get('admin/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdminServices() {
    return this.servicesService.findAllAdminServices();
  }

  @Post('services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.createService(createServiceDto);
  }

  @Patch('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }

  @Post('service-requests')
  @UseGuards(JwtAuthGuard)
  createServiceRequest(
    @Req() request: ServicesRequest,
    @Body() createServiceRequestDto: CreateServiceRequestDto,
  ) {
    return this.servicesService.createServiceRequest(request.user.sub, createServiceRequestDto);
  }

  @Get('service-requests/my')
  @UseGuards(JwtAuthGuard)
  findMyServiceRequests(@Req() request: ServicesRequest) {
    return this.servicesService.findMyServiceRequests(request.user.sub);
  }

  @Get('admin/service-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAdminServiceRequests() {
    return this.servicesService.findAllAdminServiceRequests();
  }

  @Patch('admin/service-requests/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateServiceRequestStatus(
    @Param('id') id: string,
    @Body() updateServiceRequestStatusDto: UpdateServiceRequestStatusDto,
  ) {
    return this.servicesService.updateServiceRequestStatus(id, updateServiceRequestStatusDto);
  }
}
