import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pathway')
export class Pathway {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;
}
