import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { Dispatch, SetStateAction, useState } from 'react';
import ReactSelect from 'react-select';

import { Button, Field, FieldProps, getSelectStyleOverride } from '@components';
import { addApplicant, isoCountries, RecordTypeOptions, useGetEducationOptions } from '@services';
import { Modal } from '../Modal';
import addIcon from '@assets/img/add.svg';
import { ApplicantRO } from '@ien/common';

interface AddApplicantProps {
  onClose: (jobRecord?: any) => void;
  visible: boolean;
  applicants: ApplicantRO[];
  setApplicant: Dispatch<SetStateAction<ApplicantRO[]>>;
}

export const AddApplicantModal: React.FC<AddApplicantProps> = (props: AddApplicantProps) => {
  const { onClose, visible, applicants, setApplicant } = props;

  const [addEducationFields, setAddEducationFields] = useState(false);
  const educationTitles = useGetEducationOptions();

  const handleSubmit = async (values: any) => {
    const applicant = await addApplicant(values);

    if (applicant) {
      setApplicant([applicant, ...applicants]);
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
    setAddEducationFields(false);
  };

  // const initialValues: any = {
  //   first_name: '',
  //   last_name: '',
  //   email_address: '',
  //   phone_number: '',
  //   registration_date: '',
  //   country_of_citizenship: [],
  //   country_of_residence: '',
  //   pr_status: '',
  //   nursing_educations: [],
  //   is_open: true,
  // };

  const initialValues: any = {
    first_name: 'Jacob',
    last_name: 'Wacob',
    email_address: 'asd@dsa.ca',
    phone_number: '1233211234',
    registration_date: '2022-01-01',
    country_of_citizenship: [],
    country_of_residence: 'ca',
    pr_status: 'PR',
    nursing_educations: [],
    is_open: true,
  };

  // const initialValues2: IENApplicantCreateUpdateDTO = {
  //   first_name: 'Jacob',
  //   last_name: 'Wacob',
  //   email_address: 'asd@dsa.ca',
  //   phone_number: '1233211234',
  //   registration_date: '',
  //   country_of_citizenship: [],
  //   country_of_residence: 'ca',
  //   pr_status: 'PR',
  //   nursing_educations: [],
  //   is_open: true,
  // };

  const getCountries = (): RecordTypeOptions[] => {
    return Object.keys(isoCountries).map((key: string, index: number) => ({
      id: index + 1,
      title: isoCountries[key as keyof typeof isoCountries].name,
      // title: key,
    }));
  };

  // test data - will remove
  const prStatus: RecordTypeOptions[] = [
    { id: 1, title: 'Applied for Study Permit' },
    { id: 2, title: 'Permanent Resident' },
    { id: 3, title: 'Applied for Temporary Work Permit' },
    { id: 4, title: 'Canadian Citizen' },
    { id: 5, title: 'Temporary Study Permit' },
    { id: 6, title: 'Applied for Permanent Residency' },
    { id: 7, title: 'No status' },
    { id: 8, title: 'Temporary Work Permit' },
    { id: 9, title: 'PR' },
  ];

  const hideEducationFields = () => {
    setAddEducationFields(false);
  };

  const showEducationFields = () => {
    setAddEducationFields(true);
  };

  // testing purposes
  const getEducationTitle = (name: number) => {
    return educationTitles.find(t => t.id == name)?.title;
  };

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Add Applicant
      </Modal.Title>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, values, setFieldValue }) => (
          <FormikForm>
            <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7'>
              <div className='mb-1 col-span-2'>
                <Field name='first_name' label='First Name' type='text' />
              </div>
              <div className='mb-1 col-span-2'>
                <Field name='last_name' label='Last Name' type='text' />
              </div>
              <div className='mb-1 col-span-2'>
                <Field name='email_address' label='Email Address' type='text' />
              </div>
              <div className='mb-1 col-span-2'>
                <Field name='phone_number' label='Phone Number' type='text' />
              </div>
              <div className='mb-1 col-span-4'>
                <Field name='registration_date' label='Registration Date' type='date' />
              </div>
              <div className='mb-1 col-span-2'>
                <Field
                  name='country_of_citizenship'
                  label='Country of Citizenship'
                  component={({ field, form }: FieldProps) => (
                    <ReactSelect<RecordTypeOptions, true>
                      inputId={field.name}
                      value={getCountries().filter(c => field.value.includes(c.id))}
                      onBlur={field.onBlur}
                      onChange={value =>
                        form.setFieldValue(
                          field.name,
                          value.map(v => v.id),
                        )
                      }
                      options={getCountries()}
                      isOptionDisabled={option => field.value.includes(option.id)}
                      getOptionLabel={option => `${option.title}`}
                      getOptionValue={option => `${option.id}`}
                      styles={getSelectStyleOverride<RecordTypeOptions>()}
                      menuPlacement='auto'
                      isMulti
                    />
                  )}
                />
              </div>
              <div className='mb-1 col-span-2'>
                <Field
                  name='country_of_residence'
                  label='Country of Residence'
                  component={({ field, form }: FieldProps) => (
                    <ReactSelect<RecordTypeOptions>
                      inputId={field.name}
                      value={getCountries().find(s => s.id == field.value)}
                      onBlur={field.onBlur}
                      onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                      options={getCountries()}
                      isOptionDisabled={o => o.id == field.value}
                      getOptionLabel={option => `${option.title}`}
                      styles={getSelectStyleOverride<RecordTypeOptions>()}
                      menuPlacement='auto'
                    />
                  )}
                />
              </div>
              <div className='mb-1 col-span-2'>
                <Field
                  name='pr_status'
                  label='Permanent Resident Status'
                  component={({ field, form }: FieldProps) => (
                    <ReactSelect<RecordTypeOptions>
                      inputId={field.name}
                      value={prStatus.find(s => s.id == field.value)}
                      onBlur={field.onBlur}
                      onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                      options={prStatus}
                      isOptionDisabled={o => o.id == field.value}
                      getOptionLabel={option => `${option.title}`}
                      styles={getSelectStyleOverride<RecordTypeOptions>()}
                      menuPlacement='auto'
                    />
                  )}
                />
              </div>

              {addEducationFields && (
                <div className='mb-1 col-span-4 border rounded border-bcLightBackground p-5'>
                  {values.nursing_educations && values.nursing_educations.length > 0 && (
                    <div className='mb-1 col-span-4'>
                      <ul className='list-decimal my-2 pl-4'>
                        {values.nursing_educations.map(({ name, year, index }: any) => (
                          <li className='text-sm text-bcBlack' key={index}>
                            {getEducationTitle(name)} &nbsp;-&nbsp; {year}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* <pre>{JSON.stringify(values.nursing_educations, null, 2)}</pre> */}
                  <FieldArray name='nursing_educations'>
                    {({ push }) => (
                      <div className='grid grid-cols-4 gap-4'>
                        <div className='mb-1 col-span-4'>
                          <Field
                            name='name'
                            label='Education'
                            component={({ field, form }: FieldProps) => (
                              <ReactSelect<RecordTypeOptions>
                                inputId={field.name}
                                value={educationTitles.find(s => s.id == field.value)}
                                onBlur={field.onBlur}
                                onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                                options={educationTitles}
                                isOptionDisabled={o => o.id == field.value}
                                getOptionLabel={option => `${option.title}`}
                                styles={getSelectStyleOverride<RecordTypeOptions>()}
                                menuPlacement='auto'
                              />
                            )}
                          />
                        </div>
                        <div className='mb-1 col-span-2'>
                          <Field name='year' label='Year' type='text' />
                        </div>
                        <div className='mb-1 col-span-2'>
                          <Field
                            name='country'
                            label='Country'
                            component={({ field, form }: FieldProps) => (
                              <ReactSelect<RecordTypeOptions>
                                inputId={field.name}
                                value={getCountries().find(s => s.id == field.value)}
                                onBlur={field.onBlur}
                                onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                                options={getCountries()}
                                isOptionDisabled={o => o.id == field.value}
                                getOptionLabel={option => `${option.title}`}
                                styles={getSelectStyleOverride<RecordTypeOptions>()}
                                menuPlacement='top'
                              />
                            )}
                          />
                        </div>
                        <div className='mb-1 col-span-2'>
                          <Field name='num_years' label='Number of Years' type='text' />
                        </div>
                        <div className='mb-1 col-span-2'>
                          <Field name='who_knows' label='Something' type='text' />
                        </div>
                        <div className='mb-1 col-span-4 flex items-center justify-between'>
                          <Button
                            variant='secondary'
                            forModal={true}
                            type='button'
                            onClick={hideEducationFields}
                          >
                            Close
                          </Button>
                          <Button
                            variant='primary'
                            forModal={true}
                            type='button'
                            onClick={() => {
                              push({
                                name: values.name,
                                year: values.year,
                                country: values.country,
                                num_years: values.num_years,
                              });
                              setFieldValue('name', '');
                              setFieldValue('year', '');
                              setFieldValue('country', '');
                              setFieldValue('num_years', '');
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              )}
              {!addEducationFields && (
                <div className='mb-1 col-span-4'>
                  <img src={addIcon.src} alt='add' className='mr-1 inline-block' />
                  <button
                    className='text-bcBlueLink font-bold hover:text-bcBluePrimary hover:border-bcBluePrimary border-transparent border-b-2'
                    type='button'
                    onClick={showEducationFields}
                  >
                    Add Education ({values.nursing_educations && values.nursing_educations.length})
                  </button>
                </div>
              )}

              <span className='border-b-2 mb-1 col-span-4 mt-2'></span>
              <div className='mb-1 col-span-4 flex items-center justify-between'>
                <Button variant='outline' forModal={true} type='button' onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  forModal={true}
                  type='submit'
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Add
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};
