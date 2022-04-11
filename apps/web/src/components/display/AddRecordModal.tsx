import { useRouter } from 'next/router';
import { Formik, Form as FormikForm } from 'formik';
import createValidator from 'class-validator-formik';
import { toast } from 'react-toastify';

import { Modal } from '../Modal';
import { Button } from '@components';
import { addJobRecord, getAddRecordOptions, RecordTypeOptions } from '@services';
import { IENApplicantJobCreateUpdateDTO } from '@ien/common';
import { Field, Select, Option } from '../form';

interface AddRecordProps {
  jobRecords: any;
  setJobRecords: any;
}

export const AddRecordModal: React.FC<AddRecordProps> = ({ jobRecords, setJobRecords }) => {
  const router = useRouter();

  const applicantId = router?.query?.applicantId;
  const isOpen = !!router.query.record;

  const newJobRecordSchema = createValidator(IENApplicantJobCreateUpdateDTO);

  // deconstruct and get record options
  const { haPcn, jobLocation, jobTitle } = getAddRecordOptions();

  const handleClose = () => {
    delete router.query.record;
    router.back();
  };

  const handleSubmit = async (values: IENApplicantJobCreateUpdateDTO) => {
    try {
      const {
        data: { data },
      } = await addJobRecord(applicantId as string, values);

      setJobRecords([data, ...jobRecords]);

      delete router.query.record;
      router.back();
    } catch (e) {
      toast.error('There was an error adding a new record');
    }
  };

  //@todo change any type
  const initialValues: any = {
    ha_pcn: '',
    job_id: '',
    job_title: '',
    job_location: '',
    recruiter_name: '',
    job_post_date: '2022-03-10',
  };

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Add Record
      </Modal.Title>
      <div className='w-full'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={newJobRecordSchema}>
          {({ dirty, isValid }) => (
            <FormikForm>
              <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7 mb-4'>
                <div className='mb-3 col-span-2'>
                  <Select name='ha_pcn' label='Health Authority'>
                    {haPcn &&
                      haPcn.data.map((opt: RecordTypeOptions) => (
                        <Option key={opt.id} label={opt.title} value={opt.id} />
                      ))}
                  </Select>
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='job_id' label='Job ID' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Select name='job_title' label='Job Title'>
                    {jobTitle &&
                      jobTitle.data.map((opt: RecordTypeOptions) => (
                        <Option key={opt.id} label={opt.title} value={opt.id} />
                      ))}
                  </Select>
                </div>
                <div className='mb-3 col-span-2'>
                  <Select name='job_location' label='Location'>
                    {jobLocation &&
                      jobLocation.data.map((opt: RecordTypeOptions) => (
                        <Option key={opt.id} label={opt.title} value={opt.id} />
                      ))}
                  </Select>
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='recruiter_name' label='Recruiter Name' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='job_post_date' label='Date Job Was First Posted' type='date' />
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
