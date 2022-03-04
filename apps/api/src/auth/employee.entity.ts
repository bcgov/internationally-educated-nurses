import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('employee')
export class EmployeeEntity extends BaseEntity {
  @Column('varchar', { length: 128, nullable: false })
  name!: string;
  @Column('varchar', { length: 128, nullable: false })
  email!: string;
  // TODO maybe change this to an enum
  @Column('varchar', { length: 128, nullable: false })
  role!: string;
}
