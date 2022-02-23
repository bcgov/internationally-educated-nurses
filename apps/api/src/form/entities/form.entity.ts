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

  @Column('varchar', { length: 256 })
  file_name!: string;

  @Column('varchar', { length: 1024 })
  file_path!: string;

  @Column('varchar', { length: 256 })
  assigned_to!: string;

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
