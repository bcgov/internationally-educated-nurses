import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicantEntity } from './applicant.entity';
import { ApplicantStatusEntity } from './applicantStatus.entity';

@Entity('applicant_status_audit')
export class ApplicantStatusAuditEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ApplicantStatusEntity, status => status.applicants)
  @JoinColumn({ name: 'status_id' })
  status!: ApplicantStatusEntity;

  @ManyToOne(() => ApplicantEntity, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant?: ApplicantEntity;

  @Column('date')
  start_date!: Date;

  @Column('date', { nullable: true })
  end_date?: Date;

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  // We need to identify details that we want to capture here.
  @Column('varchar', { nullable: true })
  added_by?: string;

  @Column('varchar', { nullable: true })
  added_by_id?: string;

  @Column('varchar', { nullable: true })
  updated_by?: string;

  @Column('varchar', { nullable: true })
  updated_by_id?: string;

  @Expose()
  public get status_period() {
    if (this.start_date != null && this.end_date != null) {
      const time = new Date(this.end_date).getTime() - new Date(this.start_date).getTime();
      return time / (24 * 60 * 60 * 1000);
    } else {
      return null;
    }
  }
}
