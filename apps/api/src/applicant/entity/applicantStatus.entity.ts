import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApplicantEntity } from './applicant.entity';
import { ApplicantStatusAuditEntity } from './applicantStatusAudit.entity';

@Entity('applicant_status')
export class ApplicantStatusEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  status!: string;

  @ManyToOne(() => ApplicantStatusEntity, status => status.id)
  parent?: ApplicantStatusEntity;

  @OneToMany(() => ApplicantStatusEntity, status => status.parent)
  children!: ApplicantStatusEntity[];

  // only use for relation reference, We will not attach it in services
  @OneToMany(() => ApplicantEntity, applicant => applicant.status)
  applicants!: ApplicantEntity[];

  // only use for relation reference, We will not attach it in services
  @OneToMany(() => ApplicantStatusAuditEntity, applicant_status => applicant_status.status)
  applicant_status!: ApplicantStatusAuditEntity[];
}
