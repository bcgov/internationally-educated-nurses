import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_ha_pcn')
export class IENHaPcn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar', { nullable: true })
  abbreviation?: string;

  @Column('varchar', { nullable: true })
  description?: string;
}
