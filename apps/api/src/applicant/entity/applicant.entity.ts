import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ApplicantAuditEntity } from './applicantAudit.entity';
import { ApplicantStatusEntity } from './applicantStatus.entity';
import { ApplicantStatusAuditEntity } from './applicantStatusAudit.entity';

@Entity('applicants')
export class ApplicantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  first_name!: string;

  @Column('varchar', { nullable: true })
  last_name!: string;

  @Column('varchar')
  profession!: string;

  @Column('varchar', { nullable: true })
  specialty!: string;

  @Column('varchar', { nullable: true })
  assigned_to!: string;

  @Column('varchar')
  ha_pcn!: string;

  @ManyToOne(() => ApplicantStatusEntity, status => status.applicants)
  @JoinColumn({ name: 'status_id' })
  status!: ApplicantStatusEntity;

  @Column('date', { nullable: true })
  first_referral!: Date;

  @Column('date', { nullable: true })
  latest_referral?: Date;

  @Column('date', { nullable: true })
  followed_up?: Date;

  @Column('date', { nullable: true })
  date_matched?: Date;

  @Column({ nullable: true })
  comment?: string;

  @Column('varchar', { nullable: true })
  added_by?: string;

  @Column('varchar', { nullable: true })
  added_by_id?: string;

  @Column({ default: true })
  is_open!: boolean;

  @Column('jsonb', { nullable: true })
  additional_data?: JSON;

  @OneToMany(
    () => ApplicantStatusAuditEntity,
    applicant_status_audit => applicant_status_audit.applicant,
  )
  applicant_status_audit!: ApplicantStatusAuditEntity[];

  @OneToMany(() => ApplicantAuditEntity, applicant_audit => applicant_audit.applicant)
  applicant_audit!: ApplicantAuditEntity[];

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_date!: Date;
}
