import { Entity, Column, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/database/base.entity';
import { EmploymentTypes, getStreamById, streamsById, SubmissionPayloadDTO } from '@ehpr/common';

@Entity('submission')
export class SubmissionEntity extends BaseEntity {
  @Exclude()
  @Column('jsonb', { nullable: false })
  payload!: SubmissionPayloadDTO;

  @Column('varchar', { nullable: true })
  confirmationId!: string;

  @Exclude()
  @Column('varchar', { nullable: true })
  chesId?: string;

  @Exclude()
  @Column('varchar', { nullable: false })
  version!: string;

  @BeforeInsert()
  beforeInsert() {
    const { credentialInformation, preferencesInformation } = this.payload;

    // Remove specialties if the stream is non clinical or if selected stream has no specialties
    if (
      credentialInformation.stream === streamsById.Nonclinical.id ||
      getStreamById(credentialInformation.stream).specialties.length === 0
    ) {
      this.payload.credentialInformation.specialties = [];
    }

    // Remove Health authorities if the user is not a resident or employed
    if (
      ![EmploymentTypes.HEALTH_SECTOR_EMPLOYED, EmploymentTypes.HEALTH_SECTORY_RESIDENCY].includes(
        credentialInformation.currentEmployment,
      )
    ) {
      this.payload.credentialInformation.healthAuthorities = [];
    }

    // Remove current employment if the user is not currently employed
    if (EmploymentTypes.NOT_HEALTH_SECTOR_EMPLOYED === credentialInformation.currentEmployment) {
      delete this.payload.credentialInformation.employmentCircumstance;
    }
    if (this.payload.credentialInformation.stream !== streamsById.Nonclinical.id) {
      delete this.payload.credentialInformation.nonClinicalJobTitle;
    }

    // Remove deployment locations if the user agrees to deploy anywhere.
    if (preferencesInformation.deployAnywhere) {
      this.payload.preferencesInformation.deploymentLocations = [];
    }
  }
}
