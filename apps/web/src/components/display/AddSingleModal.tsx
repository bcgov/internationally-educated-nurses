import { Formik, Form as FormikForm } from 'formik';
import createValidator from 'class-validator-formik';

import { Modal } from '../Modal';
import { useRouter } from 'next/router';
import { Button } from '../Button';
import { Field, Option, Select } from '../form';
import {
  addApplicant,
  professionOptionsArray,
  recruitmentStatusArray,
  specialityOptionsArray,
} from '@services';
import { ApplicantCreateDTO } from '@ien/common';

export const AddSingleModal: React.FC<any> = ({ applicants, setApplicants }) => {
  const router = useRouter();

  const isOpen = !!router.query.add_row;

  const newApplicantSchema = createValidator(ApplicantCreateDTO);

  const initialValues: any = {
    first_name: '',
    last_name: '',
    profession: undefined,
    specialty: undefined,
    assigned_to: 'Jill',
    ha_pcn: 'HA',
    status: '',
    first_referral: '2022-01-02',
    latest_referral: '2022-02-02',
    followed_up: '2022-01-22',
    date_matched: '2022-02-02',
    comment: undefined,
    added_by: 'Jack',
    added_by_id: 'abhcd1-89cbd0e9-4bha6d87c-amc34ee59',
    is_open: true,
    additional_data: undefined,
    status_date: '2022-03-02',
  };

  const handleClose = () => {
    delete router.query.add_row;
    // router.push(router.route, undefined, { shallow: true });
    router.back();
  };

  const handleSubmit = async (values: ApplicantCreateDTO) => {
    const {
      data: { data },
    } = await addApplicant(values);

    // update table data with new applicant
    setApplicants([data, ...applicants]);

    delete router.query.add_row;
    router.back();
  };

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <Modal.Title as='h1' className='text-lg font-medium leading-6 text-bcBlueLink border-b p-4'>
        Add Record
      </Modal.Title>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={newApplicantSchema}>
        {({ dirty, isValid }) => (
          <FormikForm>
            <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-8 mb-4'>
              <div className='mb-3 col-span-2'>
                <Field name='first_name' label='First Name' type='text' />
              </div>
              <div className='mb-3 col-span-2'>
                <Field name='last_name' label='Last Name' type='text' />
              </div>
              <div className='mb-3 col-span-2'>
                <Select name='profession' label='Profession'>
                  {professionOptionsArray.map(opt => (
                    <Option key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Select>
              </div>
              <div className='mb-3 col-span-2'>
                <Select name='specialty' label='Specialty'>
                  {specialityOptionsArray.map(opt => (
                    <Option key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Select>
              </div>

              <div className='mb-3 col-span-4'>
                <Select name='status' label='Recruitment Status'>
                  {recruitmentStatusArray.map(opt => (
                    <Option key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Select>
              </div>
              <span className='border-b-2 col-span-4 my-2'></span>
              <div className='mb-3 col-span-4'>
                <Field name='first_referral' label='Referral Date' type='date' />
              </div>
              <span className='border-b-2 col-span-4 mt-2'></span>
              <div className='col-span-4 flex items-center justify-between'>
                <Button variant='secondary' type='button' onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant='primary' type='submit' disabled={!dirty || !isValid}>
                  Add Record
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};
