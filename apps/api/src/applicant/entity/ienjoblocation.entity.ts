import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IENHaPcn } from './ienhapcn.entity';

@Entity('ien_job_locations')
export class IENJobLocation {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  title!: string;

  @ManyToOne(() => IENHaPcn, { eager: true })
  @JoinColumn({ name: 'ha_pcn_id' })
  ha_pcn!: IENHaPcn;
}
