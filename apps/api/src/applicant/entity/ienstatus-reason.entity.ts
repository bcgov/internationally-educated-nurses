import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_status_reasons')
export class IENStatusReason {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Column({ nullable: true })
  @Exclude()
  i_e_n_program!: boolean;

  @Column({ nullable: true })
  @Exclude()
  recruitment!: boolean;
}
