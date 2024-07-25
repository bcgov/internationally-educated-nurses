import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form as FormikForm, FieldProps } from 'formik';
import { createValidator } from '@utils/dto-validator';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { Button, getSelectStyleOverride, Input } from '@components';
import {
  ApplicantJobRO,
  IENApplicantJobCreateUpdateDTO,
  isHiredByUs,
  RegionalHealthAuthorities,
} from '@ien/common';
import {
  addJobRecord,
  useGetAddRecordOptions,
  RecordTypeOptions,
  updateJobRecord,
} from '@services';
import hiredIndIcon from '@assets/img/hired_indicator.svg';
import { ApplicantStatusAuditRO } from '@ien/common/src/ro/applicant.ro';
import { Field } from '../form';
import { Modal } from '../Modal';
import { useApplicantContext } from '../applicant/ApplicantContext';
import { useAuthContext } from '../AuthContexts';
import { DatePickerField } from '../form/DatePickerField';

interface AddRecordProps {
  job?: ApplicantJobRO;
  milestones?: ApplicantStatusAuditRO[];
  onClose: (jobRecord?: ApplicantJobRO) => void;
  visible: boolean;
  setExpandRecord?: (expand: boolean) => void | undefined;
}

export const AddRecordModal: React.FC<AddRecordProps> = (props: AddRecordProps) => {
  const { job, milestones, visible, onClose, setExpandRecord } = props;

  const { applicant, fetchApplicant } = useApplicantContext();
  const { authUser } = useAuthContext();

  const router = useRouter();

  const applicantId = router?.query?.id as string;

  const newJobRecordSchema = createValidator(IENApplicantJobCreateUpdateDTO);

  // deconstruct and get record options
  const { haPcn, jobLocation, jobTitle } = useGetAddRecordOptions();

  const isDuplicate = ({ job_id, ha_pcn }: IENApplicantJobCreateUpdateDTO) => {
    const result = applicant?.jobs?.find(j => {
      if (!j.job_id) return false;
      return j.job_id === job_id && j.ha_pcn.id === ha_pcn;
    });
    return result && (!job || result !== job);
  };

  const handleSubmit = async (values: IENApplicantJobCreateUpdateDTO) => {
    if (values.job_post_date === '') {
      values.job_post_date = undefined;
    }

    if (isDuplicate(values)) {
      toast.error('There is a job record with the same health authority and job id.');
      return;
    }

    const data = job
      ? await updateJobRecord(applicantId, job.id, values)
      : await addJobRecord(applicantId, values);

    if (data) {
      fetchApplicant();
    }

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

  const isRegionalAuthority = (ha_pcn_id: string): boolean => {
    const authority = haPcn.data.find(ha => ha.id === ha_pcn_id);
    return RegionalHealthAuthorities.some(rha => rha.name === authority?.title);
  };

  const initialValues: IENApplicantJobCreateUpdateDTO = {
    ha_pcn: `${job?.ha_pcn?.id || authUser?.ha_pcn_id || ''}`,
    job_id: `${job?.job_id || ''}`,
    job_title: `${job?.job_title?.id || ''}`,
    job_location: job?.job_location?.map(j => j.id) ?? [],
    job_post_date: `${job?.job_post_date || ''}`,
  };

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        {job ? 'Edit Record' : 'Add Record'}
      </Modal.Title>
      {isHiredByUs(applicant, authUser) && (
        <div className='mx-8 p-3 bg-bcYellowCream text-bcBrown mt-6 rounded border-2 border-bcYellowCreamStroke'>
          <div className='font-bold flex items-center'>
            <img src={hiredIndIcon.src} alt='add' className='m-1 h-5' />
            Important Reminder
          </div>
          <div className='px-7'>
            This applicant has already accepted a job offer. You can still add a job competition for
            this applicant.
          </div>
        </div>
      )}
      <div className='w-full'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={newJobRecordSchema}>
          {({ isSubmitting }) => (
            <FormikForm>
              <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7'>
                <div className='mb-3 col-span-2'>
                  {authUser?.ha_pcn_id ? (
                    <Field
                      name='ha_pcn'
                      label='Health Authorities'
                      type='text'
                      disabled
                      value={authUser?.organization}
                    />
                  ) : (
                    <Field
                      name='ha_pcn'
                      label='Health Authority'
                      component={({ field, form }: FieldProps) => (
                        <ReactSelect<RecordTypeOptions<string>>
                          inputId={field.name}
                          value={haPcn?.data?.find(s => s.id == field.value)}
                          onBlur={field.onBlur}
                          onChange={value => {
                            form.setFieldValue(field.name, `${value?.id}`);
                            form.setFieldValue('job_location', []);
                          }}
                          options={haPcn?.data?.map(s => ({
                            ...s,
                            isDisabled: s.id == field.value,
                          }))}
                          getOptionLabel={option => `${option.title}`}
                          styles={getSelectStyleOverride<RecordTypeOptions<string>>()}
                          components={{ Input }}
                        />
                      )}
                    />
                  )}
                </div>
                <div className='mb-3 col-span-2'>
                  <Field name='job_id' label='Job ID' type='text' />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field
                    name='job_title'
                    label='Department'
                    component={({ field, form }: FieldProps) => (
                      <ReactSelect<RecordTypeOptions<string>>
                        inputId={field.name}
                        value={jobTitle?.data?.find(s => s.id == field.value)}
                        isClearable
                        onBlur={field.onBlur}
                        onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                        options={jobTitle?.data}
                        isOptionDisabled={o => o.id == field.value}
                        getOptionLabel={option => `${option.title}`}
                        styles={getSelectStyleOverride<RecordTypeOptions<string>>()}
                        components={{ Input }}
                      />
                    )}
                  />
                </div>
                <div className='mb-3 col-span-2'>
                  <Field
                    name='job_location'
                    label='Communities'
                    component={({ field, form }: FieldProps) => (
                      <ReactSelect<RecordTypeOptions<number>, true>
                        inputId={field.name}
                        value={jobLocation?.data?.filter(s => field.value.includes(s.id))}
                        onBlur={field.onBlur}
                        onChange={value =>
                          form.setFieldValue(
                            field.name,
                            value.map(v => v.id),
                          )
                        }
                        options={
                          isRegionalAuthority(form.values.ha_pcn)
                            ? jobLocation?.data?.filter(o => o.ha_pcn.id === form.values.ha_pcn)
                            : jobLocation?.data
                        }
                        getOptionLabel={option => `${option.title}`}
                        getOptionValue={option => `${option.id}`}
                        isOptionDisabled={option => field.value.includes(option.id)}
                        styles={getSelectStyleOverride<RecordTypeOptions<number>>()}
                        isDisabled={!form.values.ha_pcn}
                        isMulti
                        components={{ Input }}
                      />
                    )}
                  />
                </div>
                <div className='mb-3 col-span-2'>
                  <DatePickerField
                    name='job_post_date'
                    label='Date Job Was First Posted'
                    format='yyyy-MM-dd'
                    max={new Date()}
                    validate={(val: string) => validatePostDate(val)}
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
