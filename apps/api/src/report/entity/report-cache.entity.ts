import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
} from 'typeorm';

@Entity('report_cache')
export class ReportCacheEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('integer')
  report_number!: number;

  @Column('integer')
  report_period!: number;

  @Column('jsonb', { nullable: false })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report_data!: any;

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_date!: Date;
}
