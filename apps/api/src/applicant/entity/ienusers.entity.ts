import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';

@Entity('ien_users')
export class IENUsers {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  name!: string;

  // description: User's unique id from authentication system
  @Index({ unique: true })
  @Column('varchar', { nullable: true })
  user_id?: string;

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;

  @ManyToMany(() => IENApplicant, applicant => applicant.assigned_to)
  applicants!: IENApplicant[];
}
