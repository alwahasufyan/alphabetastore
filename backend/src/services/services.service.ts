import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { ServiceRequestStatus } from '../prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

const serviceSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  basePrice: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ServiceSelect;

const serviceRequestInclude = {
  service: {
    select: serviceSelect,
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.ServiceRequestInclude;

type ServiceRecord = Prisma.ServiceGetPayload<{
  select: typeof serviceSelect;
}>;

type ServiceRequestRecord = Prisma.ServiceRequestGetPayload<{
  include: typeof serviceRequestInclude;
}>;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublicServices() {
    const services = await this.prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: serviceSelect,
    });

    return services.map((service: ServiceRecord) => this.serializeService(service));
  }

  async findAllAdminServices() {
    const services = await this.prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: serviceSelect,
    });

    return services.map((service: ServiceRecord) => this.serializeService(service));
  }

  async createService(createServiceDto: CreateServiceDto) {
    const slug = this.createSlug(createServiceDto.slug ?? createServiceDto.name);

    try {
      const service = await this.prisma.service.create({
        data: {
          name: createServiceDto.name.trim(),
          slug,
          description: createServiceDto.description.trim(),
          basePrice: createServiceDto.basePrice,
          isActive: createServiceDto.isActive ?? true,
        },
        select: serviceSelect,
      });

      return this.serializeService(service);
    } catch (error) {
      this.handleUniqueConstraint(error, 'Service slug already exists.');
      throw error;
    }
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto) {
    await this.ensureServiceExists(id);

    try {
      const service = await this.prisma.service.update({
        where: { id },
        data: {
          name: updateServiceDto.name?.trim(),
          slug: updateServiceDto.slug ? this.createSlug(updateServiceDto.slug) : undefined,
          description: updateServiceDto.description?.trim(),
          basePrice: updateServiceDto.basePrice,
          isActive: updateServiceDto.isActive,
        },
        select: serviceSelect,
      });

      return this.serializeService(service);
    } catch (error) {
      this.handleUniqueConstraint(error, 'Service slug already exists.');
      throw error;
    }
  }

  async deleteService(id: string) {
    await this.ensureServiceExists(id);

    const linkedRequestsCount = await this.prisma.serviceRequest.count({
      where: {
        serviceId: id,
      },
    });

    if (linkedRequestsCount > 0) {
      throw new BadRequestException(
        'Cannot delete service while it has customer requests. Mark it inactive instead.',
      );
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return {
      message: 'Service deleted successfully.',
    };
  }

  async createServiceRequest(
    userId: string,
    createServiceRequestDto: CreateServiceRequestDto,
  ): Promise<Record<string, unknown>> {
    const service = await this.prisma.service.findUnique({
      where: {
        id: createServiceRequestDto.serviceId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!service || !service.isActive) {
      throw new NotFoundException('Service not found.');
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        serviceId: createServiceRequestDto.serviceId,
        userId,
        customerName: createServiceRequestDto.customerName.trim(),
        customerPhone: createServiceRequestDto.customerPhone.trim(),
        preferredDate: createServiceRequestDto.preferredDate
          ? new Date(createServiceRequestDto.preferredDate)
          : null,
        addressText: createServiceRequestDto.addressText.trim(),
        notes: createServiceRequestDto.notes?.trim() || null,
      },
      include: serviceRequestInclude,
    });

    return this.serializeServiceRequest(request);
  }

  async findMyServiceRequests(userId: string) {
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        userId,
      },
      include: serviceRequestInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map((request: ServiceRequestRecord) => this.serializeServiceRequest(request));
  }

  async findAllAdminServiceRequests() {
    const requests = await this.prisma.serviceRequest.findMany({
      include: serviceRequestInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map((request: ServiceRequestRecord) => this.serializeServiceRequest(request));
  }

  async updateServiceRequestStatus(
    id: string,
    updateServiceRequestStatusDto: UpdateServiceRequestStatusDto,
  ): Promise<Record<string, unknown>> {
    const existingRequest = await this.prisma.serviceRequest.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existingRequest) {
      throw new NotFoundException('Service request not found.');
    }

    const request = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status:
          updateServiceRequestStatusDto.status as (typeof ServiceRequestStatus)[keyof typeof ServiceRequestStatus],
        notes: updateServiceRequestStatusDto.notes?.trim() || undefined,
      },
      include: serviceRequestInclude,
    });

    return this.serializeServiceRequest(request);
  }

  private async ensureServiceExists(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    return service;
  }

  private createSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  private handleUniqueConstraint(error: unknown, message: string) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }
  }

  private serializeService(service: ServiceRecord) {
    return {
      ...service,
      basePrice: service.basePrice !== null ? Number(service.basePrice) : null,
    };
  }

  private serializeServiceRequest(request: ServiceRequestRecord) {
    return {
      id: request.id,
      serviceId: request.serviceId,
      userId: request.userId,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      preferredDate: request.preferredDate,
      addressText: request.addressText,
      notes: request.notes,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      service: this.serializeService(request.service),
      user: request.user,
    };
  }
}
