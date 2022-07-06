import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedDate!: Date;

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
