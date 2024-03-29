import { ApplicantJobRO } from '@ien/common';
import sortStatus from 'src/common/util';
import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicant } from './ienapplicant.entity';
import { IENHaPcn } from './ienhapcn.entity';
import { IENJobLocation } from './ienjoblocation.entity';
import { IENJobTitle } from './ienjobtitles.entity';
import { IENUsers } from './ienusers.entity';

@Entity('ien_applicant_jobs')
export class IENApplicantJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => IENHaPcn, { eager: true })
  ha_pcn!: IENHaPcn;

  @Column('varchar', { nullable: true })
  job_id?: string;

  @ManyToOne(() => IENJobTitle)
  job_title?: IENJobTitle | null;

  @ManyToMany(() => IENJobLocation)
  @JoinTable()
  job_location?: IENJobLocation[] | null;

  @Column('date', { nullable: true })
  job_post_date?: Date;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'added_by_id' })
  added_by?: IENUsers | null;

  // It's for reverse relation but we are not using it in services
  @ManyToOne(() => IENApplicant, applicant => applicant.jobs)
  applicant!: IENApplicant;

  @OneToMany(() => IENApplicantStatusAudit, status => status.job)
  status_audit!: IENApplicantStatusAudit[];

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  @AfterLoad()
  sortStatus() {
    if (this?.status_audit?.length) {
      this.status_audit = sortStatus(this.status_audit);
    }
  }
  toResponseObject(): ApplicantJobRO {
    return {
      id: this.id,
      ha_pcn: this.ha_pcn,
      job_id: this.job_id,
      job_title: this.job_title,
      job_location: this.job_location,
      job_post_date: this.job_post_date,
      added_by: this.added_by,
      applicant: this.applicant?.toResponseObject(),
      // Will add toResponseObject function later
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status_audit: this.status_audit as any,
      created_date: this.created_date,
      updated_date: this.updated_date,
    };
  }
}
