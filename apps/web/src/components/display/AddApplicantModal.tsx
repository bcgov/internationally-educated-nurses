import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import ReactSelect from 'react-select';
import { Disclosure as HeadlessDisclosure, Transition } from '@headlessui/react';
import createValidator from 'class-validator-formik';

import { Button, Field, FieldProps, getSelectStyleOverride, EducationForm } from '@components';
import { addApplicant, RecordTypeOptions, useGetEducationOptions } from '@services';
import { Modal } from '../Modal';
import addIcon from '@assets/img/add.svg';
import minusIcon from '@assets/img/minus.svg';
import xDeleteIcon from '@assets/img/x_delete.svg';
import { ApplicantRO, IENApplicantCreateUpdateDTO, NursingEducationDTO } from '@ien/common';
import dayjs from 'dayjs';
import { getCountries, getCountrySelector } from '../../utils/country-selector';

interface AddApplicantProps {
  onClose: () => void;
  visible: boolean;
  applicants: ApplicantRO[];
  setApplicant: Dispatch<SetStateAction<ApplicantRO[]>>;
}

export const AddApplicantModal: React.FC<AddApplicantProps> = (props: AddApplicantProps) => {
  const { onClose, visible, applicants, setApplicant } = props;

  const newApplicantValidationSchema = createValidator(IENApplicantCreateUpdateDTO);

  const educationTitles = useGetEducationOptions();

  const defaultEducationValues: NursingEducationDTO = new NursingEducationDTO('', '', '', '');

  const handleSubmit = async (values: IENApplicantCreateUpdateDTO) => {
    const empty = values.nursing_educations.pop();

    try {
      const applicant = await addApplicant(values);
      if (applicant) {
        setApplicant([applicant, ...applicants]);
      }
      onClose();
    } catch {
      empty && values.nursing_educations.push(empty);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const initialValues: IENApplicantCreateUpdateDTO = {
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: '',
    registration_date: '',
    country_of_citizenship: [],
    country_of_residence: '',
    pr_status: '',
    nursing_educations: [defaultEducationValues],
    is_open: true,
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

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Add Applicant
      </Modal.Title>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={newApplicantValidationSchema}
        enableReinitialize={true}
      >
        {({ isSubmitting, values, errors }) => (
          <FormikForm className='overflow-y-auto'>
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
                <Field
                  name='registration_date'
                  label='Registration Date'
                  type='date'
                  max={dayjs().format('YYYY-MM-DD')}
                />
              </div>
              <div className='mb-1 col-span-2'>
                <Field
                  name='country_of_citizenship'
                  label='Country of Citizenship'
                  component={({ field, form }: FieldProps) => (
                    <ReactSelect<RecordTypeOptions, true>
                      inputId={field.name}
                      value={getCountries().filter(c => field.value.includes(c.countryCode))}
                      onBlur={field.onBlur}
                      onChange={value =>
                        form.setFieldValue(
                          field.name,
                          value.map(v => v.countryCode),
                        )
                      }
                      options={getCountries()}
                      isOptionDisabled={option => field.value.includes(option.countryCode)}
                      getOptionLabel={option => `${option.title}`}
                      getOptionValue={option => `${option.countryCode}`}
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
                  component={({ field, form }: FieldProps) => getCountrySelector(field, form)}
                />
              </div>
              <div className='mb-1 col-span-2'>
                <Field
                  name='pr_status'
                  label='Permanent Resident Status'
                  component={({ field, form }: FieldProps) => (
                    <ReactSelect<RecordTypeOptions>
                      inputId={field.name}
                      value={prStatus.find(s => s.title == field.value)}
                      onBlur={field.onBlur}
                      onChange={value => form.setFieldValue(field.name, `${value?.title}`)}
                      options={prStatus}
                      isOptionDisabled={o => o.title == field.value}
                      getOptionLabel={option => `${option.title}`}
                      styles={getSelectStyleOverride<RecordTypeOptions>()}
                      menuPlacement='auto'
                    />
                  )}
                />
              </div>

              <div className='col-span-4 border-2 rounded border-bcLightBackground'>
                <div className='col-span-4'>
                  <HeadlessDisclosure defaultOpen={true}>
                    {({ open }) => (
                      <div className=''>
                        <HeadlessDisclosure.Button className={'w-full px-4'}>
                          <>
                            <div className='flex justify-between py-2'>
                              {values.nursing_educations && values.nursing_educations.length > 1 ? (
                                <span className=''>
                                  {values.nursing_educations.length - 1} Education Added
                                </span>
                              ) : (
                                'No Education Added'
                              )}

                              <span className='flex items-center text-bcBlueLink font-bold'>
                                <img
                                  src={open ? minusIcon.src : addIcon.src}
                                  alt='add'
                                  className={`mr-1 inline-block ${
                                    !open ? 'transform rotate-90 duration-300' : 'duration-300'
                                  }`}
                                />
                                {open ? 'Collapse' : 'Add Education'}
                              </span>
                            </div>
                          </>
                        </HeadlessDisclosure.Button>
                        <FieldArray name='nursing_educations'>
                          {({ remove }) => (
                            <div className='flex'>
                              {values.nursing_educations.length > 1 && (
                                <ul className='list-none mb-2 pl-3'>
                                  {values.nursing_educations
                                    .slice(0, values.nursing_educations.length)
                                    .map(
                                      (
                                        { name, year, country, num_years }: NursingEducationDTO,
                                        index,
                                      ) =>
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
                          )}
                        </FieldArray>
                        <Transition
                          enter='transition ease-in duration-500 transform'
                          enterFrom='opacity-0 '
                          enterTo='opacity-100 '
                          leave='transition ease duration-300 transform'
                          leaveFrom='opacity-100 '
                          leaveTo='opacity-0 '
                        >
                          <HeadlessDisclosure.Panel>
                            <div className='p-4'>
                              <EducationForm
                                nursing_educations={values.nursing_educations}
                                errors={errors.nursing_educations}
                                educationTitles={educationTitles}
                              />
                            </div>
                          </HeadlessDisclosure.Panel>
                        </Transition>
                      </div>
                    )}
                  </HeadlessDisclosure>
                </div>
              </div>

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
                  data-cy='add-applicant'
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
