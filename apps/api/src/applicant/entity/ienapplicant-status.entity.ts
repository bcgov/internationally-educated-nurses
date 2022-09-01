import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { IENApplicantStatusAudit } from './ienapplicant-status-audit.entity';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_applicant_status')
export class IENApplicantStatus {
  @PrimaryColumn({
    type:'uuid',
    nullable:false,
  })
  id!: string;

  @Column()
  status!: string;

  @Column('varchar', { nullable: true })
  party?: string;

  @Column('varchar', { nullable: true })
  @Exclude()
  full_name?: string;

  @Column({type:'varchar', length:256,nullable:true})
  category?:string

  // TODO - Rework 
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
