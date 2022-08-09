import { Exclude } from 'class-transformer';
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
} from 'typeorm';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicant } from './ienapplicant.entity';
import { IENHaPcn } from './ienhapcn.entity';
import { IENJobLocation } from './ienjoblocation.entity';
import { IENJobTitle } from './ienjobtitles.entity';
import { IENUsers } from './ienusers.entity';

@Entity('ien_applicant_jobs')
export class IENApplicantJob {
  @PrimaryGeneratedColumn()
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

  @Column('varchar', { nullable: true })
  recruiter_name!: string;

  @Column('date', { nullable: true })
  job_post_date?: Date;

  @ManyToOne(() => IENUsers, user => user.id)
  @Exclude()
  added_by?: IENUsers;

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
}
