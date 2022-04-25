import { useState } from 'react';
import createValidator from 'class-validator-formik';
import dayjs from 'dayjs';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';

import { buttonBase, buttonColor, Select, Option, Field } from '@components';
import {
  IENApplicantAddStatusDTO,
  formatDate,
  IENStatusReasonRO,
  ApplicantStatusAuditRO,
  IENApplicantUpdateStatusDTO,
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

//@todo change any type
const getInitialValues = (
  status?: ApplicantStatusAuditRO,
): IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO => ({
  status: `${status?.status?.id || ''}`,
  job_id: `${status?.job?.job_id || ''}`,
  added_by: `${status?.added_by || ''}`,
  start_date: `${status?.start_date || dayjs().format('YYYY-MM-DD')}`,
  notes: `${status?.notes || ''}`,
  reason: `${status?.reason || ''}`,
  effective_date: `${status?.effective_date || dayjs().format('YYYY-MM-DD')}`,
});

const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

interface AddMilestoneProps {
  applicantId: string;
  jobId: string;
  setJobMilestones: any;
}

export const AddMilestones: React.FC<AddMilestoneProps> = ({
  applicantId,
  jobId,
  setJobMilestones,
}) => {
  const handleSubmit = async (values: any, { resetForm }: any) => {
    // TODO: fix added_by field
    values.job_id = jobId.toString();
    values.added_by = '1';

    if (values.status !== '304' && values.status !== '305') {
      values.effective_date = undefined;
    }

    const data = await addMilestone(applicantId as string, values);

    // get updated milestones
    if (data && data.id) {
      const reFetchData = await getJobAndMilestones(applicantId, { job_id: jobId });

      if (reFetchData) {
        const [jobs] = reFetchData;
        setJobMilestones(jobs[0]?.status_audit || '');
      }
    }

    // reset form after submitting
    resetForm(getInitialValues());
  };

  return <MilestoneForm handleSubmit={handleSubmit} />;
};

interface EditMilestoneProps {
  milestone: ApplicantStatusAuditRO;
  handleSubmit: (milestone: IENApplicantUpdateStatusDTO) => void;
}

// Edit milestone comp *** currently unsure if this will be included moving forward
export const EditMilestones: React.FC<EditMilestoneProps> = ({ milestone, handleSubmit }) => {
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
            <span className='text-sm text-black'>
              {milestone.notes ? milestone.notes : 'No Notes Added'}
            </span>
          </div>
        </div>
      ) : (
        <>
          <MilestoneForm
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
  milestone?: ApplicantStatusAuditRO;
  handleSubmit: (
    values: IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO,
    { resetForm }?: any,
  ) => void;
  onClose?: () => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ milestone, handleSubmit, onClose }) => {
  const milestones = useGetMilestoneOptions();
  const reasons = useGetWithdrawReasonOptions();

  const submit = (
    values: IENApplicantUpdateStatusDTO | IENApplicantAddStatusDTO,
    helpers: FormikHelpers<IENApplicantUpdateStatusDTO | IENApplicantAddStatusDTO>,
  ) => {
    handleSubmit(values, helpers);
    if (onClose) onClose();
  };

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik
          initialValues={getInitialValues(milestone)}
          onSubmit={submit}
          validate={milestoneValidator}
        >
          {({ dirty, isValid, values }) => (
            <FormikForm>
              <div className='grid grid-cols-9 gap-y-2 mb-4'>
                <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                  <Select name='status' label='Milestone'>
                    {milestones &&
                      milestones.length > 0 &&
                      milestones.map((opt: MilestoneType) => (
                        <Option key={opt.id} label={opt.status} value={opt.id} />
                      ))}
                  </Select>
                </span>
                <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                  <Field name='start_date' label='Date' type='date' />
                </span>
                <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                  <Field name='notes' label='Note' type='text' />
                </span>
                {/* Withdraw reason conditional */}
                {values.status === '305' ? (
                  <>
                    <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                      <Select name='reason' label='Withdraw Reason'>
                        {reasons &&
                          reasons.length > 0 &&
                          reasons.map((opt: IENStatusReasonRO) => (
                            <Option
                              key={opt.id}
                              label={opt.name as string}
                              value={opt.id.toString()}
                            />
                          ))}
                      </Select>
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
              <button
                className={`px-3 ${
                  milestone ? buttonColor.primary : buttonColor.outline
                } ${buttonBase}`}
                disabled={!dirty || !isValid}
                type='submit'
              >
                {milestone ? (
                  'Save Changes'
                ) : (
                  <>
                    <img src={addIcon.src} alt='add' className='mr-2' /> Add Milestones
                  </>
                )}
              </button>
              {milestone && (
                <button
                  className={`ml-2 px-7 border-2 ${buttonBase} ${buttonColor.outline} border-bcBluePrimary`}
                  onClick={onClose}
                >
                  Cancel
                </button>
              )}
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
