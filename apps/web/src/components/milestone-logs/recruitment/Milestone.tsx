import { useState } from 'react';
import createValidator from 'class-validator-formik';
import dayjs from 'dayjs';
import { Formik, Form as FormikForm, FormikHelpers, FieldProps } from 'formik';

import { Button, buttonBase, Field, getSelectStyleOverride, Textarea } from '@components';
import {
  IENApplicantAddStatusDTO,
  formatDate,
  IENStatusReasonRO,
  ApplicantStatusAuditRO,
  IENApplicantUpdateStatusDTO,
  ApplicantJobRO,
} from '@ien/common';
import {
  addMilestone,
  useGetMilestoneOptions,
  useGetWithdrawReasonOptions,
  MilestoneType,
  getJobAndMilestones,
} from '@services';
import addIcon from '@assets/img/add.svg';
import editIcon from '@assets/img/edit.svg';
import calendarIcon from '@assets/img/calendar.svg';
import ReactSelect from 'react-select';

const getInitialValues = (
  status?: ApplicantStatusAuditRO,
): IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO => ({
  status: `${status?.status?.id || ''}`,
  start_date: `${status?.start_date || dayjs().format('YYYY-MM-DD')}`,
  notes: `${status?.notes || ''}`,
  reason: `${status?.reason?.id || ''}`,
  effective_date: `${status?.effective_date || dayjs().format('YYYY-MM-DD')}`,
});

const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

interface AddMilestoneProps {
  applicantId: string;
  job: ApplicantJobRO;
  setJobMilestones: (milestones: ApplicantStatusAuditRO[]) => void;
}

export const AddMilestone: React.FC<AddMilestoneProps> = ({
  applicantId,
  job,
  setJobMilestones,
}) => {
  const handleSubmit = async (values: any, { resetForm }: any) => {
    values.job_id = `${job.id}`;

    if (values.status !== '304' && values.status !== '305') {
      values.effective_date = undefined;
    }

    const data = await addMilestone(applicantId as string, values);

    // get updated milestones
    if (data && data.id) {
      const reFetchData = await getJobAndMilestones(applicantId, { job_id: job.id });

      if (reFetchData) {
        const [jobs] = reFetchData;
        setJobMilestones(jobs[0]?.status_audit || []);
      }
    }

    // reset form after submitting
    resetForm(getInitialValues());
  };

  return <MilestoneForm job={job} handleSubmit={handleSubmit} />;
};

interface EditMilestoneProps {
  job: ApplicantJobRO;
  milestone: ApplicantStatusAuditRO;
  handleSubmit: (milestone: IENApplicantUpdateStatusDTO) => void;
}

// Edit milestone comp *** currently unsure if this will be included moving forward
export const EditMilestone: React.FC<EditMilestoneProps> = ({ job, milestone, handleSubmit }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      {!isEdit ? (
        <div className='border border-gray-200 rounded bg-bcLightGray my-2 p-5'>
          <div className='w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black capitalize'>
                {milestone.status.status} |{' '}
                <img
                  src={calendarIcon.src}
                  alt='calendar'
                  className='inline-block mr-1'
                  width={13}
                  height={13}
                />
                {formatDate(milestone.start_date)}
              </span>
              <button className='ml-auto mr-1'>
                <img src={editIcon.src} alt='edit' onClick={() => setIsEdit(true)} />
              </button>
            </div>
            <span className='text-sm text-black break-words'>
              {milestone.notes ? milestone.notes : 'No Notes Added'}
            </span>
          </div>
        </div>
      ) : (
        <>
          <MilestoneForm
            job={job}
            milestone={milestone}
            handleSubmit={values => handleSubmit(values as IENApplicantUpdateStatusDTO)}
            onClose={() => setIsEdit(false)}
          />
        </>
      )}
    </>
  );
};

interface MilestoneFormProps {
  job: ApplicantJobRO;
  milestone?: ApplicantStatusAuditRO;
  handleSubmit: (
    values: IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO,
    { resetForm }?: any,
  ) => void;
  onClose?: () => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ job, milestone, handleSubmit, onClose }) => {
  const milestones = useGetMilestoneOptions();
  const reasons = useGetWithdrawReasonOptions();

  const submit = (
    values: IENApplicantUpdateStatusDTO | IENApplicantAddStatusDTO,
    helpers: FormikHelpers<IENApplicantUpdateStatusDTO | IENApplicantAddStatusDTO>,
  ) => {
    handleSubmit(values, helpers);
    if (onClose) onClose();
  };

  const validateStartDate = (value: string) => {
    if (dayjs(value).diff(job.job_post_date) < 0) {
      return 'Date must be later than the date job was first posted.';
    }
    if (dayjs().diff(value) < 0) {
      return 'Date must be a past date';
    }
  };

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik
          initialValues={getInitialValues(milestone)}
          onSubmit={submit}
          validate={milestoneValidator}
        >
          {({ isSubmitting, values }) => (
            <FormikForm>
              <div className='grid grid-cols-12 gap-y-2 mb-4'>
                <span className='col-span-12 sm:col-span-6 pr-1 md:pr-2'>
                  <div>
                    <Field
                      name='status'
                      label='Milestone'
                      component={({ field, form }: FieldProps) => (
                        <ReactSelect<MilestoneType>
                          inputId={field.name}
                          value={milestones?.find(s => s.id == field.value)}
                          onBlur={field.onBlur}
                          onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                          options={milestones?.map(s => ({
                            ...s,
                            isDisabled: s.id == field.value,
                          }))}
                          getOptionLabel={option => option.status}
                          styles={getSelectStyleOverride<MilestoneType>()}
                        />
                      )}
                    />
                  </div>

                  <div className='pt-4'>
                    <Field
                      name='start_date'
                      label='Date'
                      type='date'
                      validate={val => validateStartDate(val)}
                    />
                  </div>
                </span>

                <span className='col-span-12 sm:col-span-6  pr-1 md:pr-2 ml-3'>
                  <Textarea name='notes' label='Notes' />
                </span>
                {/* Withdraw reason conditional field */}
                {values.status === '305' ? (
                  <>
                    <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                      <Field
                        name='reason'
                        label='Withdraw Reason'
                        component={({ field, form }: FieldProps) => (
                          <ReactSelect<IENStatusReasonRO>
                            inputId={field.name}
                            value={reasons?.find(opt => opt.id == field.value)}
                            onBlur={field.onBlur}
                            onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                            options={reasons?.map(opt => ({
                              ...opt,
                              isDisabled: opt.id == field.value,
                            }))}
                            getOptionLabel={opt => `${opt.name}`}
                            getOptionValue={opt => `${opt.id}`}
                            styles={getSelectStyleOverride<IENStatusReasonRO>()}
                          />
                        )}
                      />
                    </span>
                    <div className='col-span-12 sm:col-span-6 lg:col-span-2 md:pr-2 mt-auto'>
                      {/* hiding add new reason button until implemented, kept in dom for layout purposes */}
                      <div className='invisible'>
                        <button
                          className={`border border-bcGray rounded text-bcGray ${buttonBase} pointer-events-none`}
                        >
                          <span className='whitespace-nowrap px-1 text-bcGray text-xs'>
                            Add New Reason
                          </span>
                          <img src={addIcon.src} alt='add reason' />
                        </button>
                      </div>
                    </div>

                    <span className='col-span-12 sm:col-span-6 lg:col-span-4 pr-1 md:pr-2'>
                      <Field name='effective_date' label='Effective Date' type='date' />
                    </span>
                  </>
                ) : null}

                {/* Position offered conditional */}
                {values.status === '304' ? (
                  <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                    <Field name='effective_date' label='Target Start Date' type='date' />
                  </span>
                ) : null}
              </div>
              <Button
                className='px-3'
                variant={milestone ? 'primary' : 'outline'}
                disabled={isSubmitting}
                type='submit'
                loading={isSubmitting}
              >
                {milestone ? 'Save Changes' : <span className='px-10'>Save</span>}
              </Button>
              {milestone && (
                <Button
                  className='ml-2 px-7 border-2 border-bcBluePrimary'
                  variant='outline'
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
