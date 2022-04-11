import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ien_job_titles')
export class IENJobTitle {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  title!: string;
}
