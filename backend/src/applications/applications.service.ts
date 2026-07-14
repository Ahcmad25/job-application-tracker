import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, JobApplication, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

type ApplicationStatistics = {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
};

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateApplicationDto): Promise<JobApplication> {
    return this.prisma.jobApplication.create({
      data: {
        company: dto.company.trim(),
        position: dto.position.trim(),
        jobUrl: dto.jobUrl?.trim(),
        status: dto.status ?? ApplicationStatus.APPLIED,
        appliedDate: new Date(dto.appliedDate),
        notes: dto.notes?.trim(),
        userId,
      },
    });
  }

  findAll(
    userId: number,
    status?: ApplicationStatus,
    search?: string,
  ): Promise<JobApplication[]> {
    const normalizedSearch = search?.trim();

    const where: Prisma.JobApplicationWhereInput = {
      userId,
      ...(status ? { status } : {}),
      ...(normalizedSearch
        ? {
            OR: [
              {
                company: {
                  contains: normalizedSearch,
                  mode: 'insensitive',
                },
              },
              {
                position: {
                  contains: normalizedSearch,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    return this.prisma.jobApplication.findMany({
      where,
      orderBy: [
        {
          appliedDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findOne(userId: number, id: number): Promise<JobApplication> {
    const application = await this.prisma.jobApplication.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      throw new NotFoundException(
        `Job application with ID ${id} was not found`,
      );
    }

    return application;
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateApplicationDto,
  ): Promise<JobApplication> {
    await this.findOne(userId, id);

    return this.prisma.jobApplication.update({
      where: {
        id,
      },
      data: {
        ...(dto.company !== undefined ? { company: dto.company.trim() } : {}),
        ...(dto.position !== undefined
          ? { position: dto.position.trim() }
          : {}),
        ...(dto.jobUrl !== undefined ? { jobUrl: dto.jobUrl.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.appliedDate !== undefined
          ? { appliedDate: new Date(dto.appliedDate) }
          : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes.trim() } : {}),
      },
    });
  }

  async remove(userId: number, id: number): Promise<{ message: string }> {
    await this.findOne(userId, id);

    await this.prisma.jobApplication.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Job application deleted successfully',
    };
  }

  async getStatistics(userId: number): Promise<ApplicationStatistics> {
    const [total, applied, interview, offer, rejected, withdrawn] =
      await this.prisma.$transaction([
        this.prisma.jobApplication.count({
          where: {
            userId,
          },
        }),
        this.prisma.jobApplication.count({
          where: {
            userId,
            status: ApplicationStatus.APPLIED,
          },
        }),
        this.prisma.jobApplication.count({
          where: {
            userId,
            status: ApplicationStatus.INTERVIEW,
          },
        }),
        this.prisma.jobApplication.count({
          where: {
            userId,
            status: ApplicationStatus.OFFER,
          },
        }),
        this.prisma.jobApplication.count({
          where: {
            userId,
            status: ApplicationStatus.REJECTED,
          },
        }),
        this.prisma.jobApplication.count({
          where: {
            userId,
            status: ApplicationStatus.WITHDRAWN,
          },
        }),
      ]);

    return {
      total,
      applied,
      interview,
      offer,
      rejected,
      withdrawn,
    };
  }
}
