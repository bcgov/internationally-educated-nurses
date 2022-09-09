import { Exclude } from 'class-transformer';
import sortStatus from 'src/common/util';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { IENApplicantAudit } from './ienapplicant-audit.entity';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicantStatus } from './ienapplicant-status.entity';
import { IENApplicantJob } from './ienjob.entity';
import { IENUsers } from './ienusers.entity';
import { ApplicantRO, HaPcnDTO, IENUserRO, NursingEducationDTO } from '@ien/common';

@Entity('ien_applicants')
export class IENApplicant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Index({ unique: true })
  @Column('uuid', { nullable: true })
  applicant_id?: string;

  @Column('varchar', { nullable: true })
  email_address?: string;

  @Column('varchar', { nullable: true })
  phone_number?: string;

  @Column('date', { nullable: true })
  registration_date?: Date;

  @Column('jsonb', { nullable: true })
  assigned_to?: IENUserRO[];

  @Column('jsonb', { nullable: true })
  country_of_citizenship?: string[];

  @Column('varchar', { nullable: true })
  country_of_residence?: string;

  @Column('varchar', { nullable: true })
  pr_status?: string;

  @Column('jsonb', { nullable: true })
  nursing_educations?: NursingEducationDTO[];

  @Column('varchar', { nullable: true })
  bccnm_license_number?: string;

  @Column('jsonb', { nullable: true })
  health_authorities?: HaPcnDTO[];

  @Column('jsonb', { nullable: true })
  notes?: JSON;

  @ManyToOne(() => IENApplicantStatus, status => status.applicants)
  @JoinColumn({ name: 'status_id' })
  status?: IENApplicantStatus;

  @Column('jsonb', { nullable: true })
  additional_data?: JSON;

  @Exclude()
  @Column({ default: true })
  is_open!: boolean;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'added_by_id' })
  added_by!: IENUsers;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by!: IENUsers;

  @OneToMany(() => IENApplicantJob, job => job.applicant)
  jobs!: IENApplicantJob[];

  @OneToMany(
    () => IENApplicantStatusAudit,
    applicant_status_audit => applicant_status_audit.applicant,
  )
  applicant_status_audit!: IENApplicantStatusAudit[];

  @OneToMany(() => IENApplicantAudit, applicant_audit => applicant_audit.applicant)
  applicant_audit?: IENApplicantAudit[];

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  @AfterLoad()
  sortStatus() {
    if (this?.applicant_status_audit?.length) {
      this.applicant_status_audit = sortStatus(this.applicant_status_audit);
    }
  }
  toResponseObject(): ApplicantRO {
    return {
      id: this.id,
      name: this.name,
      applicant_id: this.applicant_id,
      email_address: this.email_address,
      phone_number: this.phone_number,
      registration_date: this.registration_date,
      assigned_to: this.assigned_to,
      country_of_citizenship: this.country_of_citizenship,
      country_of_residence: this.country_of_residence,
      pr_status: this.pr_status,
      nursing_educations: this.nursing_educations,
      bccnm_license_number: this.bccnm_license_number,
      health_authorities: this.health_authorities,
      notes: this.notes,
      status: this.status?.toResponseObject(),
      additional_data: this.additional_data,
      is_open: this.is_open,
      added_by: this.added_by,
      updated_by: this.updated_by,
      jobs: this.jobs?.map(job => job.toResponseObject()),
      // Will add to Response object functions later
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      applicant_status_audit: this.applicant_status_audit as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      applicant_audit: this.applicant_audit as any,
      created_date: this.created_date,
      updated_date: this.updated_date,
    };
  }
}
