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
  JoinTable,
  ManyToMany,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { IENApplicantAudit } from './ienapplicant-audit.entity';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicantStatus } from './ienapplicant-status.entity';
import { IENHaPcn } from './ienhapcn.entity';
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
  @Column('varchar', { nullable: true, comment: 'HMBC ATS system unique ID' })
  applicant_id?: string;

  @Column('varchar', { nullable: true })
  email?: string;

  @Column('varchar', { nullable: true })
  citizenship?: string;

  @Column('varchar', { nullable: true })
  country_of_training?: string;

  @Column({ default: false })
  pr_of_canada?: boolean;

  @ManyToMany(() => IENHaPcn, hc_pcn => hc_pcn.applicants, { cascade: true })
  @JoinTable()
  ha_pcn?: IENHaPcn[];

  @ManyToMany(() => IENUsers, user => user.applicants, { cascade: true })
  @JoinTable()
  assigned_to?: IENUsers[];

  @ManyToOne(() => IENApplicantStatus, status => status.applicants)
  @JoinColumn({ name: 'status_id' })
  status!: IENApplicantStatus;

  @Column('varchar', { nullable: true })
  education?: string;

  @Column('date', { nullable: true })
  registration_date?: Date;

  @Column('jsonb', { nullable: true })
  additional_data?: JSON;

  @Column('date', { nullable: true })
  @Exclude()
  status_date?: Date;

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
