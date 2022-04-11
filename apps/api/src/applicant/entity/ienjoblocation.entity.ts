import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ien_job_locations')
export class IENJobLocation {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  title!: string;
}
