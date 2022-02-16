import {
  PersonalInformationDTO,
  ContactInformationDTO,
  CredentialInformationDTO,
  PreferencesInformationDTO,
} from '.';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class SubmissionPayloadDTO {
  constructor(base?: SubmissionPayloadDTO) {
    if (base) {
      this.personalInformation = new PersonalInformationDTO(base.personalInformation);
      this.contactInformation = new ContactInformationDTO(base.contactInformation);
      this.credentialInformation = new CredentialInformationDTO(base.credentialInformation);
      this.preferencesInformation = new PreferencesInformationDTO(base.preferencesInformation);
    }
  }
  @ValidateNested()
  @IsNotEmpty()
  personalInformation!: PersonalInformationDTO;

  @ValidateNested()
  @IsNotEmpty()
  contactInformation!: ContactInformationDTO;

  @ValidateNested()
  @IsNotEmpty()
  credentialInformation!: CredentialInformationDTO;

  @ValidateNested()
  @IsNotEmpty()
  preferencesInformation!: PreferencesInformationDTO;
}
