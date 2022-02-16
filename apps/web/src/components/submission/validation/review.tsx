import { Ret } from 'class-validator-formik/dist/convertError';

export interface ReviewType {
  confirm: boolean;
}

export const reviewDefaultValues = {
  confirm: false,
};

export const reviewSchema = (values: unknown): Ret => {
  if (!(values as ReviewType).confirm) {
    return {
      confirm: 'This field must be checked',
    };
  }
  return {};
};
