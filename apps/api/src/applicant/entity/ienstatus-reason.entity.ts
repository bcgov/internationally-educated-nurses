import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ien_status_reasons')
export class IENStatusReason {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  name!: string;

  @Column({ nullable: true })
  @Exclude()
  i_e_n_program!: boolean;

  @Column({ nullable: true })
  @Exclude()
  recruitment!: boolean;
}
