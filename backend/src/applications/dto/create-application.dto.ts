import { ApplicationStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  company: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  position: string;

  @IsOptional()
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'jobUrl must be a valid URL including http:// or https://',
    },
  )
  @MaxLength(500)
  jobUrl?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsDateString()
  appliedDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
