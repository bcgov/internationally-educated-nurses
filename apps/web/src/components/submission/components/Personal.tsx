import { Field, FormStepHeader } from '@components';
import { FormStepProps } from '.';

export const Personal: React.FC<FormStepProps> = ({ formKey }) => {
  const fieldNames = {
    firstName: `${formKey}.firstName`,
    lastName: `${formKey}.lastName`,
    postalCode: `${formKey}.postalCode`,
  };
  return (
    <>
      <FormStepHeader>1. Primary Information</FormStepHeader>
      <div className='flex flex-col gap-3'>
        <Field name={fieldNames.firstName} label='First Name' type='text' />
        <Field name={fieldNames.lastName} label='Last Name' type='text' />
        <Field
          name={fieldNames.postalCode}
          label='Postal Code'
          description='Format: A1A 1A1'
          type='text'
        />
      </div>
    </>
  );
};
