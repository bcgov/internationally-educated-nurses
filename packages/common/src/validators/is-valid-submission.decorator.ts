import { registerDecorator, ValidationError, ValidationOptions, Validator } from 'class-validator';
import { SubmissionPayloadDTO } from '../dto/submission-payload.dto';

const validator = new Validator();
export function IsValidSubmission(validationOptions?: ValidationOptions) {
  let results: ValidationError[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateNestedObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: SubmissionPayloadDTO) {
          const newValue = new SubmissionPayloadDTO(value);
          results = await validator.validate(newValue as SubmissionPayloadDTO);
          return results.length === 0;
        },
        defaultMessage: () => {
          const readableErrors = results.map(result => getNestedError(result));
          return JSON.stringify(readableErrors);
        },
      },
    });
  };
}

// Recursive functions return any: https://github.com/microsoft/TypeScript/issues/21952#issue-297220945
const getNestedError = (error: ValidationError): unknown => {
  if (error.children && !error.constraints) {
    return error.children.map(child => getNestedError(child));
  }
  return { [error.property]: error.constraints };
};
