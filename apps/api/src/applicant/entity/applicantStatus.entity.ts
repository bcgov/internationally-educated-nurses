import {Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ApplicantEntity } from "./applicant.entity";

@Entity('applicant_status')
export class ApplicantStatusEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    status!: string;

    @ManyToOne(() => ApplicantStatusEntity, status => status.id)
    parent?: ApplicantStatusEntity;

    @OneToMany(() => ApplicantStatusEntity, status => status.parent)
    children!: ApplicantStatusEntity[];
    
    @OneToMany(() => ApplicantEntity, applicant => applicant.status)
    applicants!: ApplicantEntity[];
}