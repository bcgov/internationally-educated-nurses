import { FieldArray, FormikErrors } from 'formik';
import ReactSelect from 'react-select';

import { Button, Field, FieldProps, getSelectStyleOverride } from '@components';
import { RecordTypeOptions } from '@services';
import xDeleteIcon from '@assets/img/x_delete.svg';
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
      {({ push, remove }) => (
        <div className='grid grid-cols-4 gap-4'>
          <div className='mb-1 col-span-4'>
            <div className='flex'>
              {nursing_educations.length > 1 && (
                <ul className='list-none mb-2'>
                  {nursing_educations.slice(0, lastIndex).map(
                    ({ name, year, country, num_years }: NursingEducationDTO, index) =>
                      name &&
                      year &&
                      country &&
                      num_years && (
                        <li
                          className='w-max flex items-center text-sm font-bold text-bcGray bg-bcLightGray p-1 my-1 rounded border-bcGray border-2'
                          key={name + year + country + num_years}
                        >
                          {name} &nbsp;-&nbsp; {year}
                          <img
                            src={xDeleteIcon.src}
                            alt='add'
                            className='ml-auto pl-2'
                            onClick={() => remove(index)}
                          />
                        </li>
                      ),
                  )}
                </ul>
              )}
            </div>
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
            {/* <Error name='nursing_educations' /> */}
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
              component={getCountrySelector}
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
            {typeof errors === 'string' && <p className=' block text-red-600 text-sm'>{errors}</p>}
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
