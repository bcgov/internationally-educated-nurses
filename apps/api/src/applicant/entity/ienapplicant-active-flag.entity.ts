import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';
import { ApplicantActiveFlagRO } from '@ien/common';
import { IENApplicantStatus } from './ienapplicant-status.entity';

@Entity('ien_applicants_active_flag')
export class IENApplicantActiveFlag {
  @PrimaryColumn('uuid')
  applicant_id!: string;

  @PrimaryColumn('uuid')
  ha_id!: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ type: 'uuid', nullable: true })
  status_id?: string;

  @ManyToOne(() => IENApplicant, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant!: IENApplicant;

  @ManyToOne(() => IENApplicantStatus, status => status.id)
  @JoinColumn({ name: 'status_id' })
  status?: IENApplicantStatus;

  toResponseObject(): ApplicantActiveFlagRO {
    return {
      applicant_id: this.applicant_id,
      ha_id: this.ha_id,
      is_active: this.is_active,
      status: this.status?.status,
    };
  }
}
