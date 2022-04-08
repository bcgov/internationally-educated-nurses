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

@Entity('ien_applicants')
export class IENApplicant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  // description: 'HMBC ATS system unique ID'
  @Index({ unique: true })
  @Column('bigint', { nullable: true, comment: 'HMBC ATS system unique ID' })
  applicant_id?: number;

  @Column('varchar', { nullable: true })
  email_address?: string;

  @Column('varchar', { nullable: true })
  phone_number?: string;

  @Column('date', { nullable: true })
  registration_date?: Date;

  @Column('jsonb', { nullable: true })
  assigned_to?: JSON;

  @Column('jsonb', { nullable: true })
  country_of_citizenship?: string[];

  @Column('varchar', { nullable: true })
  country_of_residence?: string;

  @Column('varchar', { nullable: true })
  pr_status?: string;

  @Column('jsonb', { nullable: true })
  nursing_educations?: JSON;

  @Column('varchar', { nullable: true })
  bccnm_license_number?: string;

  @Column('jsonb', { nullable: true })
  health_authorities?: JSON;

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
  @Exclude()
  updated_date!: Date;

  @AfterLoad()
  sortStatus() {
    if (this?.applicant_status_audit?.length) {
      this.applicant_status_audit = sortStatus(this.applicant_status_audit);
    }
  }
}
