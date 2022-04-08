import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ien_education')
export class IENEducation {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  title!: string;
}
