import { Exclude } from 'class-transformer';
import { Entity, Column, Index, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('ien_users')
export class IENUsers {
  @PrimaryColumn()
  id!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar', { nullable: true })
  @Exclude()
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
