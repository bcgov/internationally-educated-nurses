import { useRouter } from 'next/router';
import { Formik, Form as FormikForm } from 'formik';
import { Field, Select, Option } from '../form';

import { Modal } from '../Modal';
import { Button } from '@components';

export const AddRecordModal: React.FC = () => {
  const router = useRouter();

  const isOpen = !!router.query.record;

  const handleClose = () => {
    delete router.query.record;
    router.back();
  };

  const handleSubmit = async (values: any) => {
    // @todo hook up endpoint and remove log
    console.log('record values: ', values);
    delete router.query.record;
    router.back();
  };

  //@todo change any type
  const initialValues: any = {
    ha_pcn: '',
    job_id: '',
    job_title: '',
    location: '',
    recruiter_name: '',
    posting_date: '2022-03-10',
  };

  // fake array values for Select options, temporary
  const fakeArrayT = [
    { value: '1', label: 'Health Authority' },
    { value: '6', label: 'HMBC - Registered for HMBC services' },
  ];

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Add Record
      </Modal.Title>
      <div className='w-full'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ dirty, isValid }) => (
            <FormikForm>
              <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7 mb-4'>
                <div className='mb-3 col-span-2'>
                  <Select name='ha_pcn' label='Health Authority'>
                    {fakeArrayT.map(opt => (
                      <Option key={opt.value} label={opt.label} value={opt.value} />
                    ))}
                  </Select>
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='job_id' label='Job ID' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Select name='job_title' label='Job Title'>
                    {fakeArrayT.map(opt => (
                      <Option key={opt.value} label={opt.label} value={opt.value} />
                    ))}
                  </Select>
                </div>
                <div className='mb-3 col-span-2'>
                  <Select name='location' label='Location'>
                    {fakeArrayT.map(opt => (
                      <Option key={opt.value} label={opt.label} value={opt.value} />
                    ))}
                  </Select>
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='recruiter_name' label='Recruiter Name' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='posting_date' label='Date Job Was First Posted' type='date' />
                </div>
                <span className='border-b-2 col-span-4 mt-2'></span>
                <div className='col-span-4 flex items-center justify-between'>
                  <Button variant='secondary' forModal={true} type='button' onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant='primary'
                    forModal={true}
                    type='submit'
                    disabled={!dirty || !isValid}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
