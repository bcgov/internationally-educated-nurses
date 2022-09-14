import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_job_titles')
export class IENJobTitle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  title!: string;
}
