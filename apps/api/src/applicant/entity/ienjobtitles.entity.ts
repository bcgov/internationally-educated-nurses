import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_job_titles')
export class IENJobTitle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  title!: string;
}
