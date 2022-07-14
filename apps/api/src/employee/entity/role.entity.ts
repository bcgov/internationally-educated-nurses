import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@ien/common';
import { AccessEntity } from './acl.entity';

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

  @ManyToMany(() => AccessEntity, { eager: true })
  @JoinTable()
  acl!: AccessEntity[];
}
