import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';
import { IENUsers } from './ienusers.entity';

@Entity('ien_applicant_audit')
export class IENApplicantAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => IENApplicant, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant!: IENApplicant;

  @Column('json', { nullable: true })
  data!: JSON;

  @CreateDateColumn()
  created_date!: Date;

  @ManyToOne(() => IENUsers, user => user.id)
  @JoinColumn({ name: 'added_by_id' })
  added_by!: IENUsers | null;
}
