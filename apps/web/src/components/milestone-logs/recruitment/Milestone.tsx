import React, { useState } from 'react';
import createValidator from 'class-validator-formik';
import dayjs from 'dayjs';
import { Formik, Form as FormikForm, FormikHelpers, FieldProps } from 'formik';
import ReactSelect from 'react-select';

import { Button, buttonBase, Field, getSelectStyleOverride, Textarea } from '@components';
import {
  IENApplicantAddStatusDTO,
  formatDate,
  IENStatusReasonRO,
  ApplicantStatusAuditRO,
  IENApplicantUpdateStatusDTO,
  ApplicantJobRO,
  STATUS,
} from '@ien/common';
import {
  addMilestone,
  useGetMilestoneOptions,
  useGetWithdrawReasonOptions,
  MilestoneType,
} from '@services';
import addIcon from '@assets/img/add.svg';
import editIcon from '@assets/img/edit.svg';
import calendarIcon from '@assets/img/calendar.svg';
import userIcon from '@assets/img/user.svg';
import deleteIcon from '@assets/img/trash_can.svg';
import disabledDeleteIcon from '@assets/img/disabled-trash_can.svg';
import { useApplicantContext } from '../../../applicant/ApplicantContext';
import { useAuthContext } from 'src/components/AuthContexts';
import { DeleteMilestoneModal } from 'src/components/display/DeleteMilestoneModal';

type MilestoneFormValues = IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO;

const getInitialValues = <T extends MilestoneFormValues>(status?: ApplicantStatusAuditRO): T =>
  ({
    status: `${status?.status?.id || ''}`,
    start_date: `${status?.start_date || ''}`,
    notes: `${status?.notes || ''}`,
    reason: `${status?.reason?.id || ''}`,
    effective_date: `${status?.effective_date || ''}`,
  } as T);

const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

interface AddMilestoneProps {
  job: ApplicantJobRO;
}

export const AddMilestone = ({ job }: AddMilestoneProps) => {
  const { applicant, updateJob } = useApplicantContext();

  const handleSubmit = async (
    values: IENApplicantAddStatusDTO,
    helpers?: FormikHelpers<IENApplicantAddStatusDTO>,
  ) => {
    values.job_id = `${job.id}`;

    const milestone = await addMilestone(applicant.id, values);

    // get updated milestones
    if (milestone && milestone.id) {
      const milestones = [...(job.status_audit || []), milestone];
      updateJob({ ...job, status_audit: milestones });
    }

    // reset form after submitting
    helpers && helpers.resetForm(getInitialValues());
  };

  return <MilestoneForm<IENApplicantAddStatusDTO> job={job} handleSubmit={handleSubmit} />;
};

interface EditMilestoneProps {
  job: ApplicantJobRO;
  milestone: ApplicantStatusAuditRO;
  handleSubmit: (milestone: IENApplicantUpdateStatusDTO) => Promise<void>;
  editing: ApplicantStatusAuditRO | null;
  onEditing: (editing: ApplicantStatusAuditRO | null) => void;
}

export const EditMilestone: React.FC<EditMilestoneProps> = props => {
  const { deleteMilestone } = useApplicantContext();

  const { job, milestone, handleSubmit, editing, onEditing } = props;
  const { authUser } = useAuthContext();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const canDelete = (loggedInId: number | undefined, addedById: number | undefined) => {
    return loggedInId && loggedInId === addedById;
  };

  const handleDeleteMilestone = (milestoneId?: string) => {
    setDeleteModalVisible(false);

    if (milestoneId) {
      deleteMilestone(milestoneId, job.id);
    }
  };

  const deleteButton = () => {
    return canDelete(authUser?.user_id, milestone.added_by?.id) ? (
      <button onClick={() => setDeleteModalVisible(true)}>
        <img src={deleteIcon.src} alt='delete milestone' />
      </button>
    ) : (
      <button className='pointer-events-none'>
        <img src={disabledDeleteIcon.src} alt='delete milestone' />
      </button>
    );
  };
  return (
    <>
      {editing !== milestone ? (
        <div className='border border-gray-200 rounded bg-bcLightGray my-2 p-5'>
          <div className='w-full'>
            <div className='flex items-center font-bold text-black '>
              <span className='capitalize'>{milestone.status.status}</span>
              <span className='mx-2'>|</span>
              <span className='mr-2'>
                <img src={calendarIcon.src} alt='calendar' width={16} height={16} />
              </span>
              <span>{formatDate(milestone.start_date)}</span>
              {(milestone.updated_by?.email || milestone.added_by?.email) && (
                <>
                  <span className='mx-2'>|</span>
                  <span className='mr-2'>
                    <img src={userIcon.src} alt='user' />
                  </span>
                  <span>Last updated by</span>
                  <a
                    className='ml-2'
                    href={`mailto: ${milestone.updated_by?.email || milestone.added_by?.email}`}
                  >
                    {milestone.updated_by?.email || milestone.added_by?.email}
                  </a>
                </>
              )}
              <button
                className='ml-auto mr-2'
                onClick={() => onEditing(milestone)}
                disabled={!!editing && milestone === editing}
              >
                <img src={editIcon.src} alt='edit milestone' />
              </button>
              {deleteButton()}
            </div>
            <span className='text-sm text-black break-words'>
              {milestone.notes ? milestone.notes : 'No Notes Added'}
            </span>
          </div>
          <DeleteMilestoneModal
            onClose={handleDeleteMilestone}
            visible={deleteModalVisible}
            userId={authUser?.user_id}
            milestoneId={milestone.id}
          />
        </div>
      ) : (
        <>
          <MilestoneForm<IENApplicantUpdateStatusDTO>
            job={job}
            milestone={milestone}
            handleSubmit={values => handleSubmit(values as IENApplicantUpdateStatusDTO)}
            onClose={() => onEditing(null)}
          />
        </>
      )}
    </>
  );
};

interface MilestoneFormProps<T extends MilestoneFormValues> {
  job: ApplicantJobRO;
  milestone?: ApplicantStatusAuditRO;
  handleSubmit: (values: T, { resetForm }?: FormikHelpers<T>) => Promise<void>;
  onClose?: () => void;
}

const MilestoneForm = <T extends MilestoneFormValues>({
  job,
  milestone,
  handleSubmit,
  onClose,
}: MilestoneFormProps<T>) => {
  const milestones = useGetMilestoneOptions();
  const reasons = useGetWithdrawReasonOptions();

  const submit = async (values: T, helpers: FormikHelpers<T>) => {
    if (values.status !== `${STATUS.Candidate_accepted_the_job_offer}`) {
      values.effective_date = undefined;
    }

    await handleSubmit(values, helpers);
    if (onClose) onClose();
  };

  const validateStartDate = (value: string) => {
    if (dayjs(value).diff(job.job_post_date) < 0) {
      return 'Date must be later than the date job was first posted';
    }
    if (dayjs().diff(value) < 0) {
      return 'Date must be a past date';
    }
  };

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik<T>
          initialValues={getInitialValues<T>(milestone)}
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
                          styles={getSelectStyleOverride<MilestoneType>('bg-white')}
                        />
                      )}
                    />
                  </div>

                  <div className='pt-4'>
                    <Field
                      name='start_date'
                      label='Date'
                      type='date'
                      bgColour='bg-white'
                      min={job.job_post_date}
                      max={dayjs().format('YYYY-MM-DD')}
                      validate={(val: string) => validateStartDate(val)}
                    />
                  </div>
                </span>

                <span className='col-span-12 sm:col-span-6  pr-1 md:pr-2 ml-3'>
                  <Textarea name='notes' label='Notes' />
                </span>
                {/* Withdraw reason conditional field */}
                {values.status === `${STATUS.Candidate_withdrew}` ? (
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
                            styles={getSelectStyleOverride<IENStatusReasonRO>('bg-white')}
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
                  </>
                ) : null}

                {/* Candidate accepted job offer conditional */}
                {values.status === `${STATUS.Candidate_accepted_the_job_offer}` ? (
                  <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                    <Field
                      name='effective_date'
                      label='Target Start Date'
                      type='date'
                      bgColour='bg-white'
                      max='9999-12-31'
                    />
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
                {milestone ? 'Save Changes' : 'Save Milestone'}
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
