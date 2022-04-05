import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ien_ha_pcn')
export class IENHaPcn {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  title!: string;

  @Column('varchar', { nullable: true })
  abbreviation?: string;

  @Column('varchar', { nullable: true })
  description?: string;
}
