import { FieldArray, FormikErrors } from 'formik';
import ReactSelect from 'react-select';

import { Button, Field, FieldProps, getSelectStyleOverride, Error } from '@components';
import { RecordTypeOptions } from '@services';
import { NursingEducationDTO } from '@ien/common';
import { getCountrySelector } from '../../utils/country-selector';

interface NursingEducationProps {
  nursing_educations: NursingEducationDTO[];
  errors: string | string[] | FormikErrors<NursingEducationDTO>[] | undefined;
  educationTitles: RecordTypeOptions[];
}

export const EducationForm: React.FC<NursingEducationProps> = (props: NursingEducationProps) => {
  const { nursing_educations, errors, educationTitles } = props;

  const lastIndex = nursing_educations.length - 1;

  return (
    <FieldArray name='nursing_educations'>
      {({ push }) => (
        <div className='grid grid-cols-4 gap-4'>
          <div className='mb-1 col-span-4'>
            <Field
              name={`nursing_educations[${lastIndex}].name`}
              label='Education'
              component={({ field, form }: FieldProps) => (
                <ReactSelect<RecordTypeOptions>
                  inputId={field.name}
                  value={educationTitles.find(s => s.title == field.value)}
                  onBlur={field.onBlur}
                  onChange={value => form.setFieldValue(field.name, `${value?.title}`)}
                  options={educationTitles}
                  isOptionDisabled={o => o.id == field.value}
                  getOptionLabel={option => `${option.title}`}
                  getOptionValue={option => `${option.title}`}
                  styles={getSelectStyleOverride<RecordTypeOptions>()}
                  menuPlacement='auto'
                />
              )}
            />
          </div>
          <div className='mb-1 col-span-2'>
            <Field
              name={`nursing_educations[${lastIndex}].year`}
              label='Year'
              type='number'
              max={new Date().getFullYear()}
              min={1900}
            />
          </div>
          <div className='mb-1 col-span-2'>
            <Field
              name={`nursing_educations[${lastIndex}].country`}
              label='Country'
              component={({ field, form }: FieldProps) => getCountrySelector(field, form)}
            />
          </div>
          <div className='mb-1 col-span-2'>
            <Field
              name={`nursing_educations[${lastIndex}].num_years`}
              label='Number of Years'
              type='number'
              min={1}
            />
          </div>
          <div className='mb-1 col-span-4 flex items-center justify-between'>
            {typeof errors === 'string' && <Error name='nursing_educations' />}
            <Button
              className='ml-auto px-7'
              variant='secondary'
              type='button'
              onClick={() => push(new NursingEducationDTO('', '', '', ''))}
              disabled={
                typeof errors === 'object' ||
                Object.values(nursing_educations[lastIndex]).every(v => !v)
              }
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </FieldArray>
  );
};
