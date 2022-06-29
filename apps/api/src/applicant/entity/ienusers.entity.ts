import { Exclude } from 'class-transformer';
import { Entity, Column, Index, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ien_users')
export class IENUsers {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Index({ unique: true })
  @Column('varchar', { nullable: true })
  email?: string;

  // description: User's unique id from authentication system
  @Index({ unique: true })
  @Column('varchar', { nullable: true })
  @Exclude()
  user_id?: string;

  @CreateDateColumn()
  @Exclude()
  created_date!: Date;
}
