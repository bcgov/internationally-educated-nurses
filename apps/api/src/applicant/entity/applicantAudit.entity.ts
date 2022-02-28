import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApplicantEntity } from './applicant.entity';

@Entity('applicant_audit')
export class ApplicantAuditEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ApplicantEntity, applicant => applicant.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant!: ApplicantEntity;

  @Column('json', { nullable: true })
  data!: JSON;

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  // We need to identify details that we want to capture here.
  @Column('varchar', { nullable: true })
  added_by?: string;

  @Column('varchar', { nullable: true })
  added_by_id?: string;
}
