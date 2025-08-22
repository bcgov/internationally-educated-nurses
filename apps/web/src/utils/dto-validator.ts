import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

const dtoValidator = <T extends object>(
  type: new () => T,
  values: unknown,
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
  <T extends object>(schema: new () => T) =>
  (data: unknown) =>
    dtoValidator(schema, data);
