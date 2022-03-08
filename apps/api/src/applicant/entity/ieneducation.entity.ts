import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_education')
export class IENEducation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  title!: string;
}