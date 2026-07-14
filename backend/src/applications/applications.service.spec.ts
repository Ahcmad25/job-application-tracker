import { NotFoundException } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  let applicationsService: ApplicationsService;

  const prismaServiceMock = {
    jobApplication: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    applicationsService = module.get<ApplicationsService>(ApplicationsService);
  });

  it('creates an application for the authenticated user', async () => {
    const createdApplication = {
      id: 1,
      company: 'Acme Technologies',
      position: 'Backend Developer',
      jobUrl: null,
      status: ApplicationStatus.APPLIED,
      appliedDate: new Date('2026-07-14'),
      notes: null,
      userId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaServiceMock.jobApplication.create.mockResolvedValue(
      createdApplication,
    );

    const result = await applicationsService.create(10, {
      company: ' Acme Technologies ',
      position: ' Backend Developer ',
      status: ApplicationStatus.APPLIED,
      appliedDate: '2026-07-14',
    });

    expect(prismaServiceMock.jobApplication.create).toHaveBeenCalledWith({
      data: {
        company: 'Acme Technologies',
        position: 'Backend Developer',
        jobUrl: undefined,
        status: ApplicationStatus.APPLIED,
        appliedDate: new Date('2026-07-14'),
        notes: undefined,
        userId: 10,
      },
    });

    expect(result).toEqual(createdApplication);
  });

  it('returns only applications owned by the user', async () => {
    prismaServiceMock.jobApplication.findMany.mockResolvedValue([]);

    await applicationsService.findAll(
      10,
      ApplicationStatus.INTERVIEW,
      'backend',
    );

    expect(prismaServiceMock.jobApplication.findMany).toHaveBeenCalledWith({
      where: {
        userId: 10,
        status: ApplicationStatus.INTERVIEW,
        OR: [
          {
            company: {
              contains: 'backend',
              mode: 'insensitive',
            },
          },
          {
            position: {
              contains: 'backend',
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: [
        {
          appliedDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  });

  it('finds an application owned by the user', async () => {
    const application = {
      id: 1,
      userId: 10,
    };

    prismaServiceMock.jobApplication.findFirst.mockResolvedValue(application);

    const result = await applicationsService.findOne(10, 1);

    expect(prismaServiceMock.jobApplication.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        userId: 10,
      },
    });

    expect(result).toEqual(application);
  });

  it('does not return another user’s application', async () => {
    prismaServiceMock.jobApplication.findFirst.mockResolvedValue(null);

    await expect(applicationsService.findOne(10, 999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deletes an owned application', async () => {
    prismaServiceMock.jobApplication.findFirst.mockResolvedValue({
      id: 1,
      userId: 10,
    });

    prismaServiceMock.jobApplication.delete.mockResolvedValue({
      id: 1,
    });

    const result = await applicationsService.remove(10, 1);

    expect(prismaServiceMock.jobApplication.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(result).toEqual({
      message: 'Job application deleted successfully',
    });
  });

  it('returns application statistics', async () => {
    prismaServiceMock.$transaction.mockResolvedValue([6, 2, 1, 1, 1, 1]);

    const result = await applicationsService.getStatistics(10);

    expect(result).toEqual({
      total: 6,
      applied: 2,
      interview: 1,
      offer: 1,
      rejected: 1,
      withdrawn: 1,
    });
  });
});
