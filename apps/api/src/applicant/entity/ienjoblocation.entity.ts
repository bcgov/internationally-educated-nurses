import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_job_locations')
export class IENJobLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  title!: string;
}
