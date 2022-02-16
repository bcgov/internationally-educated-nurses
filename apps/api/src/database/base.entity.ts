import { Exclude } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  @Exclude()
  createdDate!: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedDate!: Date;
}
