import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AclBase } from '@ien/common';

@Entity('access')
export class AccessEntity implements AclBase {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  slug!: string;

  @Column('varchar')
  description!: string;
}
