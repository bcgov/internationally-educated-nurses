import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee, EmployeeRO } from '@ien/common';
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

  toResponseObject(): EmployeeRO {
    return {
      created_date: this.created_date,
      email: this.email,
      id: this.id,
      keycloakId: this.keycloakId,
      name: this.name,
      organization: this.organization,
      roles: this.roles,
      updated_date: this.updated_date,
      revoked_access_date: this.revoked_access_date,
      user_id: '',
    };
  }
}
