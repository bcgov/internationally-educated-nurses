import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

// TODO: Remove
export function ValidateArray(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: unknown[]) {
          const acceptedValues: unknown[] = Object.values(validationOptions?.context.accepts);
          if (!value) return false;
          const invalidValues = value.filter((val: unknown) => {
            return !acceptedValues.includes(val);
          });

          return invalidValues.length === 0;
        },
        defaultMessage: (args: ValidationArguments) => {
          const { value } = args;
          const { accepts, name } = validationOptions?.context;

          if (!value) return `Error validating ${name} array. Value is undefined.`;

          const acceptedValues: unknown[] = Object.values(accepts);

          const invalidValues = value.filter((val: unknown) => {
            return !acceptedValues.includes(val);
          });

          return `Error validating ${name} array. Invalid values: ${JSON.stringify(invalidValues)}`;
        },
      },
    });
  };
}
