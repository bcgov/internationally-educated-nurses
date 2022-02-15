import {
  EmploymentTypes,
  RegistrationStatus,
  HealthAuthorities,
  EmploymentCircumstances,
} from '../interfaces';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsArrayOfSpecialties } from '../validators/is-array-of-specialties.decorator';
import { StreamId, streamsById, validStreamIds } from '../helper';
import { ValidateArray } from '../validators/validate-array.decorator';

export class CredentialInformationDTO {
  constructor(base?: CredentialInformationDTO) {
    if (base) {
      this.stream = base.stream;
      this.registrationNumber = base.registrationNumber;
      this.registrationStatus = base.registrationStatus;
      this.specialties = base.specialties?.map(specialty => new SpecialtyDTO(specialty));
      this.currentEmployment = base.currentEmployment;
      this.healthAuthorities = base.healthAuthorities;
      this.employmentCircumstance = base.employmentCircumstance;
      this.nonClinicalJobTitle = base.nonClinicalJobTitle;
    }
  }

  @IsIn(validStreamIds, { message: 'Invalid stream type selection' })
  @IsString({ message: 'Stream Type is required' })
  stream!: StreamId;

  @IsIn(Object.values(RegistrationStatus), { message: 'Invalid registration status selection' })
  @IsString({ message: 'Registration status is required' })
  registrationStatus!: RegistrationStatus;

  @IsString({ message: 'Invalid value' })
  @IsOptional()
  registrationNumber?: string;

  @IsIn(Object.values(EmploymentTypes), { message: 'Invalid employment type selection' })
  @IsString({ message: 'Current employment selection is required' })
  currentEmployment!: EmploymentTypes;

  @ValidateIf(o => !!o.stream && o.stream !== streamsById.Nonclinical.id)
  @Validate(IsArrayOfSpecialties)
  // TODO Verify specialties are validated on the backend
  specialties!: SpecialtyDTO[];

  @ValidateIf(o =>
    [EmploymentTypes.HEALTH_SECTOR_EMPLOYED, EmploymentTypes.HEALTH_SECTORY_RESIDENCY].includes(
      o.currentEmployment,
    ),
  )
  @IsArray({ message: 'Health authority selection is required' })
  @ArrayMinSize(1, { message: 'Health authority selection is required' })
  @ArrayMaxSize(Object.values(HealthAuthorities).length, {
    message: 'Invalid health authority selection',
  })
  @ValidateArray({ context: { accepts: HealthAuthorities, name: 'HealthAuthorities' } })
  healthAuthorities?: HealthAuthorities[];

  @ValidateIf(o => EmploymentTypes.NOT_HEALTH_SECTOR_EMPLOYED === o.currentEmployment)
  @IsIn(Object.values(EmploymentCircumstances), { message: 'Invalid circumstance selection' })
  @IsString({ message: 'Circumstance selection is required' })
  employmentCircumstance?: EmploymentCircumstances;

  @MaxLength(40, { message: 'Job title must be less than 40 characters' })
  @IsString({ message: 'Job title is required' })
  @IsNotEmpty({ message: 'Job title is required' })
  @ValidateIf(o => o.stream === streamsById.Nonclinical.id)
  nonClinicalJobTitle?: string;
}

export class SpecialtyDTO {
  constructor(base?: SpecialtyDTO) {
    if (base) {
      this.id = base.id;
      this.subspecialties = base.subspecialties?.map(
        subspecialty => new SubspecialtyDTO(subspecialty),
      );
    }
  }

  @IsString({ message: 'Specialty is required' })
  @Length(5, 255, { message: 'Specialty must be between 1 and 255 characters' })
  id!: string;

  @IsArray({ message: 'Health authority selection is required' })
  @ArrayMinSize(1, { message: 'Health authority selection is required' })
  @ArrayMaxSize(5, {
    message: 'Invalid subspecialty selection',
  })
  @ValidateNested()
  subspecialties?: SubspecialtyDTO[];
}

export class SubspecialtyDTO {
  constructor(base?: SubspecialtyDTO) {
    if (base) {
      this.id = base.id;
    }
  }

  @IsString({ message: 'Specialty is required' })
  id!: string;
}
