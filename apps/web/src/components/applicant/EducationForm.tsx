import { FieldArray, FormikHelpers, FormikErrors } from 'formik';
import ReactSelect from 'react-select';

import { Button, Field, FieldProps, getSelectStyleOverride } from '@components';
import { isoCountries, RecordTypeOptions } from '@services';
import xDeleteIcon from '@assets/img/x_delete.svg';
import { NursingEducationDTO } from '@ien/common';

interface NursingEducationProps {
  nursing_educations: NursingEducationDTO[];
  setFieldTouched: FormikHelpers<NursingEducationDTO>['setFieldTouched'];
  errors: string | string[] | FormikErrors<NursingEducationDTO>[] | undefined;
  educationTitles: RecordTypeOptions[];
}

const getArrayIndex = (arr?: NursingEducationDTO[]) => {
  return arr ? arr.length - 1 : 0;
};

const getCountries = (): RecordTypeOptions[] => {
  return Object.keys(isoCountries).map((key: string, index: number) => ({
    id: index + 1,
    countryCode: key.toLowerCase(),
    title: isoCountries[key as keyof typeof isoCountries].name,
  }));
};

// display any education errors on its 'Add' button click
const displayEducationErrors = (
  values: NursingEducationDTO,
  setFieldTouched: FormikHelpers<NursingEducationDTO>['setFieldTouched'],
  index: number,
) => {
  Object.keys(values).forEach(key => {
    setFieldTouched(`nursing_educations[${index}].${key}`, true, false);
  });
};

export const EducationForm: React.FC<NursingEducationProps> = (props: NursingEducationProps) => {
  const { nursing_educations, errors, setFieldTouched, educationTitles } = props;

  return (
    <FieldArray name='nursing_educations'>
      {({ push, remove }) => (
        <div className='grid grid-cols-4 gap-4'>
          <div className='mb-1 col-span-4'>
            <div className='flex'>
              {nursing_educations && nursing_educations.length > 1 && (
                <ul className='list-none mb-2'>
                  {nursing_educations.map(
                    ({ name, year, country, num_years }: NursingEducationDTO, index) => (
                      <>
                        {name && year && country && num_years && (
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
                        )}
                      </>
                    ),
                  )}
                </ul>
              )}
            </div>
            <Field
              name={`nursing_educations[${getArrayIndex(nursing_educations)}].name`}
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
              name={`nursing_educations[${getArrayIndex(nursing_educations)}].year`}
              label='Year'
              type='text'
            />
          </div>
          <div className='mb-1 col-span-2'>
            <Field
              name={`nursing_educations[${getArrayIndex(nursing_educations)}].country`}
              label='Country'
              component={({ field, form }: FieldProps) => (
                <ReactSelect<RecordTypeOptions>
                  inputId={field.name}
                  value={getCountries().find(s => s.countryCode == field.value)}
                  onBlur={field.onBlur}
                  onChange={value => form.setFieldValue(field.name, `${value?.countryCode}`)}
                  options={getCountries()}
                  isOptionDisabled={o => o.countryCode == field.value}
                  getOptionLabel={option => `${option.title}`}
                  styles={getSelectStyleOverride<RecordTypeOptions>()}
                  menuPlacement='top'
                />
              )}
            />
          </div>
          <div className='mb-1 col-span-2'>
            <Field
              name={`nursing_educations[${getArrayIndex(nursing_educations)}].num_years`}
              label='Number of Years'
              type='text'
            />
          </div>
          <div className='mb-1 col-span-4 flex items-center justify-between'>
            <Button
              className='ml-auto px-7'
              variant='secondary'
              type='button'
              onClick={() => {
                errors
                  ? displayEducationErrors(
                      nursing_educations[getArrayIndex(nursing_educations)],
                      setFieldTouched,
                      getArrayIndex(nursing_educations),
                    )
                  : push(new NursingEducationDTO('', '', '', ''));
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </FieldArray>
  );
};
