import { Field, FormStepHeader } from '@components';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import { FormStepProps } from '.';
import { SubmissionType } from '../validation';

export const Contact: React.FC<FormStepProps> = ({ formKey }) => {
  const {
    values: { contactInformation },
    setFieldValue,
  } = useFormikContext<SubmissionType>();
  const fieldNames = {
    primaryPhone: `${formKey}.primaryPhone`,
    primaryPhoneExt: `${formKey}.primaryPhoneExt`,
    secondaryPhone: `${formKey}.secondaryPhone`,
    secondaryPhoneExt: `${formKey}.secondaryPhoneExt`,
    email: `${formKey}.email`,
  };

  useEffect(() => {
    if (!contactInformation.secondaryPhone) {
      setFieldValue('contactInformation.secondaryPhoneExt', '');
    }
  }, [contactInformation.secondaryPhone, setFieldValue]);

  useEffect(() => {
    if (!contactInformation.primaryPhone) {
      setFieldValue('contactInformation.primaryPhoneExt', '');
    }
  }, [contactInformation.primaryPhone, setFieldValue]);

  return (
    <>
      <FormStepHeader>2. Contact Information</FormStepHeader>
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 items-end'>
          <div className='md:col-span-2'>
            <Field
              name={fieldNames.primaryPhone}
              label='Primary Phone Number'
              type='text'
              description='(xxx xxx xxxx)'
            />
          </div>
          <div className='md:col-span-1'>
            <Field
              name={fieldNames.primaryPhoneExt}
              label='Ext. (optional)'
              type='text'
              disabled={!contactInformation.primaryPhone}
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 items-end'>
          <div className='md:col-span-2'>
            <Field
              name={fieldNames.secondaryPhone}
              label='Secondary Phone Number (optional)'
              type='text'
              description='(xxx xxx xxxx)'
            />
          </div>
          <div className='md:col-span-1'>
            <Field
              name={fieldNames.secondaryPhoneExt}
              label='Ext. (optional)'
              type='text'
              disabled={!contactInformation.secondaryPhone}
            />
          </div>
        </div>

        <Field name={fieldNames.email} label='Email Address' type='email' />
      </div>
    </>
  );
};
