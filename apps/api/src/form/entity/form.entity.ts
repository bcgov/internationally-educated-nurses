import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
} from 'typeorm';
@Entity('form')
export class FormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 256, nullable: true })
  file_name!: string;

  @Column('varchar', { length: 1024, nullable: true })
  file_path!: string;

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_date!: Date;

  @Column('jsonb', { nullable: false })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form_data!: any;
}
