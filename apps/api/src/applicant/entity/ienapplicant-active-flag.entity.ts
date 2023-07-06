import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_applicants_active_flag')
export class IENApplicantActiveFlag {
  @PrimaryColumn('uuid')
  applicant_id!: string;

  @PrimaryColumn('uuid')
  ha_id!: string;

  @Column({ default: true })
  is_active!: boolean;

  @ManyToOne(() => IENApplicant, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant!: IENApplicant;

  toResponseObject(): any {
    return {
      applicant_id: this.applicant_id,
      ha_id: this.ha_id,
      is_active: this.is_active,
    };
  }
}
