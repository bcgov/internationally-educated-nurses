import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@ien/common';

@Entity('role')
export class RoleEntity implements Role {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  description!: string;
}
