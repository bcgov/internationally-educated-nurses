import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { IENApplicantStatus } from './ienapplicant-status.entity';
import { IENApplicant } from './ienapplicant.entity';
import { IENApplicantJob } from './ienjob.entity';
import { IENStatusReason } from './ienstatus-reason.entity';
import { IENUsers } from './ienusers.entity';
import { IenType } from '@ien/common';

@Entity('ien_applicant_status_audit')
@Index('unique_applicant_status_date', ['applicant', 'status', 'start_date'], { unique: true })
@Index('unique_applicant_status_date_job', ['applicant', 'status', 'start_date', 'job'], {
  unique: true,
})
export class IENApplicantStatusAudit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => IENApplicantStatus, status => status.applicants)
  @JoinColumn({ name: 'status_id' })
  status!: IENApplicantStatus;

  @ManyToOne(() => IENApplicantJob, job => job.id, { onDelete: 'CASCADE' })
  job?: IENApplicantJob | null;

  @ManyToOne(() => IENApplicant, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant!: IENApplicant;

  @Column('date', { nullable: true })
  start_date?: Date;

  @Column('varchar', { nullable: true })
  notes?: string;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'added_by_id' })
  added_by?: IENUsers | null;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by?: IENUsers | null;

  @ManyToOne(() => IENStatusReason, reason => reason.id, { eager: true })
  @JoinColumn({ name: 'reason_id' })
  reason?: IENStatusReason | null;

  @Column('varchar', { nullable: true })
  reason_other?: string;

  @Column('date', { nullable: true })
  effective_date?: Date;

  @Column('varchar', { nullable: true })
  type?: IenType;

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  @DeleteDateColumn()
  deleted_date!: Date;
}
