import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { LhaId, validLhaIds } from '../helper';

@ValidatorConstraint({ name: 'IsArrayOfLhas', async: false })
export class IsArrayOfLhas implements ValidatorConstraintInterface {
  validate(value: LhaId[]) {
    for (let i = 0; i < value.length; i++) {
      if (!validLhaIds.includes(value[i])) {
        return false;
      }
    }

    return true;
  }

  defaultMessage() {
    return 'Invalid location selection';
  }
}
