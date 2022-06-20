import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sync_applicants_audit')
export class SyncApplicantsAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  is_success!: boolean;

  @Column('jsonb', { nullable: true })
  additional_data?: object | unknown;

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;
}
