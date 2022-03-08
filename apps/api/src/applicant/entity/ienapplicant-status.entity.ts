import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_applicant_status')
export class IENApplicantStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  status!: string;

  @ManyToOne(() => IENApplicantStatus, status => status.id)
  parent?: IENApplicantStatus;

  @OneToMany(() => IENApplicantStatus, status => status.parent)
  children!: IENApplicantStatus[];

  // only use for relation reference, We will not attach it in services
  @OneToMany(() => IENApplicant, applicant => applicant.status)
  applicants!: IENApplicant[];

  // only use for relation reference, We will not attach it in services
  @OneToMany(() => IENApplicantStatusAudit, applicant_status => applicant_status.status)
  applicant_status!: IENApplicantStatusAudit[];
}
