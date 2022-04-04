import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ien_status_reasons')
export class IENStatusReason {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  name!: string;
}
