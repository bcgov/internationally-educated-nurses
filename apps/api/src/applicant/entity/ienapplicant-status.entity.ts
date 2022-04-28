import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_applicant_status')
export class IENApplicantStatus {
  @PrimaryColumn()
  id!: number;

  @Column()
  status!: string;

  @Column('varchar', { nullable: true })
  party?: string;

  @Column('varchar', { nullable: true })
  @Exclude()
  full_name?: string;

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
