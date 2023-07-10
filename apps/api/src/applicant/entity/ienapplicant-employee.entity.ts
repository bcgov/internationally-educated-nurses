import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ien_applicants_recruiters_employee')
export class IENApplicantRecruiter {
  @PrimaryColumn('uuid')
  applicant_id!: string;

  @PrimaryColumn('uuid')
  ha_id!: string;

  @Column('uuid')
  employee_id!: string;
}
