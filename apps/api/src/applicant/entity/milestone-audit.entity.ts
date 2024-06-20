import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('milestone_audit')
export class MilestoneAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  table!: string;

  @Column('varchar')
  field!: string;

  @Column('uuid')
  record_id!: string;

  @Column('varchar')
  old_value!: string;

  @Column('varchar')
  new_value!: string;

  @CreateDateColumn()
  created_date!: Date;
}
