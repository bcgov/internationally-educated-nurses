import { useRouter } from 'next/router';
import { Formik, Form as FormikForm, FieldProps } from 'formik';
import createValidator from 'class-validator-formik';
import ReactSelect from 'react-select';
import dayjs from 'dayjs';

import { Button, getSelectStyleOverride } from '@components';
import { ApplicantJobRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';
import {
  addJobRecord,
  useGetAddRecordOptions,
  RecordTypeOptions,
  updateJobRecord,
} from '@services';
import { Field } from '../form';
import { Modal } from '../Modal';
import { ApplicantStatusAuditRO } from '@ien/common/src/ro/applicant.ro';

interface AddRecordProps {
  job?: ApplicantJobRO;
  milestones?: ApplicantStatusAuditRO[];
  onClose: (jobRecord?: ApplicantJobRO) => void;
  visible: boolean;
  setExpandRecord?: (expand: boolean) => void | undefined;
}

export const AddRecordModal: React.FC<AddRecordProps> = (props: AddRecordProps) => {
  const { job, milestones, visible, onClose, setExpandRecord } = props;

  const router = useRouter();

  const applicantId = router?.query?.id as string;

  const newJobRecordSchema = createValidator(IENApplicantJobCreateUpdateDTO);

  // deconstruct and get record options
  const { haPcn, jobLocation, jobTitle } = useGetAddRecordOptions();

  const handleSubmit = async (values: IENApplicantJobCreateUpdateDTO) => {
    if (values.job_post_date === '') {
      values.job_post_date = undefined;
    }

    const data = job
      ? await updateJobRecord(applicantId, job.id, values)
      : await addJobRecord(applicantId, values);

    if (setExpandRecord) {
      setExpandRecord(true);
    }

    onClose(data);
  };

  const validatePostDate = (value: string) => {
    const milestoneDates = milestones?.map(s => s.start_date).sort();
    if (milestoneDates?.length && dayjs(milestoneDates[0]).diff(value) < 0) {
      return 'Date must be earlier than milestone start dates. ';
    }
    if (dayjs().diff(value) < 0) {
      return 'Date must be a past date';
    }
  };

  const initialValues: IENApplicantJobCreateUpdateDTO = {
    ha_pcn: `${job?.ha_pcn?.id || ''}`,
    job_id: `${job?.job_id || ''}`,
    job_title: `${job?.job_title?.id || ''}`,
    job_location: `${job?.job_location?.id || ''}`,
    recruiter_name: job?.recruiter_name || '',
    job_post_date: `${job?.job_post_date || ''}`,
  };

  return (
    <Modal open={visible} handleClose={close}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Add Record
      </Modal.Title>
      <div className='w-full'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={newJobRecordSchema}>
          {({ isSubmitting }) => (
            <FormikForm>
              <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7'>
                <div className='mb-3 col-span-2'>
                  <Field
                    name='ha_pcn'
                    label='Health Authority'
                    component={({ field, form }: FieldProps) => (
                      <ReactSelect<RecordTypeOptions>
                        inputId={field.name}
                        value={haPcn?.data?.find(s => s.id == field.value)}
                        onBlur={field.onBlur}
                        onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                        options={haPcn?.data?.map(s => ({ ...s, isDisabled: s.id == field.value }))}
                        getOptionLabel={option => option.title}
                        styles={getSelectStyleOverride<RecordTypeOptions>()}
                      />
                    )}
                  />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='job_id' label='Job ID' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field
                    name='job_title'
                    label='Department'
                    component={({ field, form }: FieldProps) => (
                      <ReactSelect<RecordTypeOptions>
                        inputId={field.name}
                        value={jobTitle?.data?.find(s => s.id == field.value)}
                        onBlur={field.onBlur}
                        onChange={value => {
                          form.setFieldValue(field.name, `${value?.id}`);
                        }}
                        options={jobTitle?.data?.map(s => ({
                          ...s,
                          isDisabled: s.id == field.value,
                        }))}
                        getOptionLabel={option => option.title}
                        styles={getSelectStyleOverride<RecordTypeOptions>()}
                      />
                    )}
                  />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field
                    name='job_location'
                    label='Location'
                    component={({ field, form }: FieldProps) => (
                      <ReactSelect<RecordTypeOptions>
                        inputId={field.name}
                        value={jobLocation?.data?.find(s => `${s.id}` === field.value)}
                        onBlur={field.onBlur}
                        onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                        options={jobLocation?.data?.map(s => ({
                          ...s,
                          isDisabled: `${s.id}` === field.value,
                        }))}
                        getOptionLabel={option => option.title}
                        styles={getSelectStyleOverride<RecordTypeOptions>()}
                      />
                    )}
                  />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='recruiter_name' label='HA Recruiter Name' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field
                    name='job_post_date'
                    label='Date Job Was First Posted'
                    type='date'
                    validate={val => validatePostDate(val)}
                  />
                </div>
                <span className='border-b-2 col-span-4 mt-2'></span>
                <div className='col-span-4 flex items-center justify-between'>
                  <Button variant='outline' forModal={true} type='button' onClick={() => onClose()}>
                    Cancel
                  </Button>
                  <Button
                    variant='primary'
                    forModal={true}
                    type='submit'
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {job ? 'Update' : 'Create'}
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
