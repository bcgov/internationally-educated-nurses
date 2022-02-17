import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SpecialtyDTO } from '../dto';
import {
  getSpecialtiesByStreamId,
  getSubSpecialtiesBySpecialtyId,
  Specialty,
  Subspecialty,
} from '../helper';
import { CredentialInformationDTO, SubspecialtyDTO } from '../dto/credential-information.dto';

enum SpecialtyErrorEnum {
  SPECIALTY_REQUIRED = 'Specialty is required',
  INVALID_SPECIALTY = 'Invalid specialty selection',
  SUBSPECIALTY_REQUIRED = 'Subspecialty is required',
  INVALID_SUBSPECIALTY = 'Invalid subspecialty selection',
}

// TODO: Remove

const isValidString = (string: string) => {
  if (typeof string === 'string' && string.length > 0) {
    return true;
  }
  return false;
};

const specialtyNotListed = (specialty: SpecialtyDTO, formSpecialties: Specialty[]) => {
  // validate specialty is including in selected stream specialty list
  if (!formSpecialties.find(formSpecialty => formSpecialty.id === specialty.id)) {
    return true;
  }
};

const subspecialtyNotListed = (subspecialty: SubspecialtyDTO, formSpecialties: Subspecialty[]) => {
  if (!formSpecialties.find(formSpecialty => formSpecialty.id === subspecialty.id)) {
    return true;
  }
};

@ValidatorConstraint({ name: 'specialties', async: false })
export class IsArrayOfSpecialties implements ValidatorConstraintInterface {
  validate(value: SpecialtyDTO[], context: ValidationArguments) {
    if (value.length === 0) return false;

    const credentialInformationState = context.object as CredentialInformationDTO;
    // currently selected stream's specialties
    const formSpecialties = getSpecialtiesByStreamId(credentialInformationState.stream);
    if (!formSpecialties.length) {
      return true;
    }
    for (const specialty of value) {
      // validate specialty.id is correct type
      if (!isValidString(specialty.id)) return false;
      // validate specialty is valid selection
      if (specialtyNotListed(specialty, formSpecialties)) return false;

      // don't validate subspecialties if they haven't been selected and aren't required by the specialty
      const formSubspecialties = getSubSpecialtiesBySpecialtyId(specialty.id);
      if (!formSubspecialties || formSubspecialties.length === 0) continue;

      // return false if specialty has subspecialties but none are selected
      if (!specialty.subspecialties || specialty.subspecialties?.length === 0) return false;

      for (const subspecialty of specialty.subspecialties) {
        // return false if subspecialties are not in the list of specialty's subspecialties
        if (subspecialtyNotListed(subspecialty, formSubspecialties)) return false;
        // return false if the value is not a string
        if (!isValidString(subspecialty.id)) {
          return false;
        }
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const { value } = args;

    if (value.length === 0) return SpecialtyErrorEnum.SPECIALTY_REQUIRED;

    const credentialInformationState = args.object as CredentialInformationDTO;
    // currently selected stream's specialties
    const formSpecialties = getSpecialtiesByStreamId(credentialInformationState.stream);

    for (const specialty of value) {
      if (!isValidString(specialty.id)) {
        return SpecialtyErrorEnum.SPECIALTY_REQUIRED;
      }
      if (specialtyNotListed(specialty, formSpecialties)) {
        return SpecialtyErrorEnum.INVALID_SPECIALTY;
      }

      // don't validate subspecialties if they haven't been selected and aren't required by the specialty
      const formSubspecialties = getSubSpecialtiesBySpecialtyId(specialty.id);
      if (!formSubspecialties || formSubspecialties.length === 0) continue;

      // check existance and length of subspecialties
      if (!specialty.subspecialties || specialty.subspecialties?.length === 0) {
        return SpecialtyErrorEnum.SUBSPECIALTY_REQUIRED;
      }

      for (const subspecialty of specialty.subspecialties) {
        if (!isValidString(subspecialty.id)) {
          return SpecialtyErrorEnum.SUBSPECIALTY_REQUIRED;
        }
        if (subspecialtyNotListed(subspecialty, formSubspecialties)) {
          return SpecialtyErrorEnum.INVALID_SUBSPECIALTY;
        }
      }
    }

    return 'Invalid specialty selection';
  }
}
