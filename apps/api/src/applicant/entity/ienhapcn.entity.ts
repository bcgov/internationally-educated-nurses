import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_ha_pcn')
export class IENHaPcn {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  title!: string;

  @Column('varchar', {nullable: true})
  description?: string;

  @ManyToMany(() => IENApplicant, applicant => applicant.ha_pcn)
  applicants!: IENApplicant[];
}
