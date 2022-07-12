import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '@ien/common';
import { RoleEntity } from './role.entity';

@Entity('employee')
export class EmployeeEntity implements Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  @Column('varchar', { length: 128, nullable: false })
  name!: string;

  @Column('varchar', { length: 128, nullable: true })
  email!: string;

  @ManyToMany(() => RoleEntity, { eager: true })
  @JoinTable()
  roles!: RoleEntity[];

  @Column('varchar', { length: 128, nullable: false, unique: true })
  keycloakId!: string;

  @Column('varchar', { length: 128, nullable: true })
  organization!: string;

  @Column('date', { nullable: true })
  revoked_access_date!: Date | null;
}
