import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { ApplicantStatusEntity } from './applicantStatus.entity';

@Entity('applicants')
export class ApplicantEntity extends BaseEntity{
  @Column('varchar')
  firstName!: string;

  @Column('varchar', { nullable: true })
  lastName!: string;

  @Column('varchar')
  profession!: string;

  @Column('varchar', { nullable: true })
  speciality!: string;

  @Column('varchar', { nullable: true })
  assignedTo!: string;

  @Column('varchar')
  haPcn!: string;

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
  addedBy?: string;

  @Column('varchar', { nullable: true })
  addedById?: string;

  @Column({default: true})
  isOpen!: boolean;

  @Column('jsonb', { nullable: true })
  additionalData?: JSON;
}
