import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

const dtoValidator = <T extends Record<any, any>>(
  type: new () => T,
  values: any,
): Partial<Record<keyof T, string>> => {
  const dto = plainToClass(type, values);
  const validationErrors = validateSync(dto);

  return validationErrors.reduce(
    (errors, currentError) => ({
      ...errors,
      [currentError.property]: Object.values(currentError.constraints || {})[0],
    }),
    {},
  );
};

export const createValidator =
  <T extends Record<any, any>>(schema: new () => T) =>
  (data: any) =>
    dtoValidator(schema, data);
