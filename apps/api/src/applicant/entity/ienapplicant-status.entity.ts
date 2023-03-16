import { IENApplicantStatusRO, StatusCategory } from '@ien/common';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_applicant_status')
export class IENApplicantStatus {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
    unique: true,
  })
  id!: string;

  @Column()
  status!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  category?: string;

  // only use for relation reference, We will not attach it in services
  @OneToMany(() => IENApplicant, applicant => applicant.status)
  applicants!: IENApplicant[];

  // only use for relation reference, We will not attach it in services
  @OneToMany(() => IENApplicantStatusAudit, applicant_status => applicant_status.status)
  applicant_status!: IENApplicantStatusAudit[];

  toResponseObject(): IENApplicantStatusRO {
    return {
      id: this.id,
      status: this.status,
      category: this.category as StatusCategory,
    };
  }
}
