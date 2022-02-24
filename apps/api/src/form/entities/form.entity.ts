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

  // TODO Add assigned_to column

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_date!: Date;

  @Column('jsonb', { nullable: false })
  // TODO create DTO for form
  form_data!: any;
}
