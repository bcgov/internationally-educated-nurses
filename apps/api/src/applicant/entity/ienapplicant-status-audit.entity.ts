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
import { IENApplicantStatus } from './ienapplicant-status.entity';
import { IENApplicant } from './ienapplicant.entity';
import { IENHaPcn } from './ienhapcn.entity';
import { IENUsers } from './ienusers.entity';

@Entity('ien_applicant_status_audit')
export class IENApplicantStatusAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => IENApplicantStatus, status => status.applicants)
  @JoinColumn({ name: 'status_id' })
  status!: IENApplicantStatus;

  @ManyToOne(() => IENHaPcn, ha_pcn => ha_pcn.id)
  @JoinColumn({ name: 'ha_pcn_id' })
  ha_pcn?: IENHaPcn | null;

  @ManyToOne(() => IENApplicant, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant!: IENApplicant;

  @Column('date')
  start_date!: Date;

  @Column('date', { nullable: true })
  end_date?: Date;

  // We need to identify details that we want to capture here.
  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'added_by_id' })
  added_by!: IENUsers | null;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by!: IENUsers | null;

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

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
