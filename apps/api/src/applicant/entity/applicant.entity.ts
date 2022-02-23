import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { ApplicantStatusEntity } from './applicantStatus.entity';

@Entity('applicants')
export class ApplicantEntity extends BaseEntity {
  @Column('varchar')
  first_name!: string;

  @Column('varchar', { nullable: true })
  last_name!: string;

  @Column('varchar')
  profession!: string;

  @Column('varchar', { nullable: true })
  speciality!: string;

  @Column('varchar', { nullable: true })
  assigned_to!: string;

  @Column('varchar')
  ha_pcn!: string;

  @ManyToOne(() => ApplicantStatusEntity, status => status.applicants)
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
}
