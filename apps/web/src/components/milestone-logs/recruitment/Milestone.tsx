import { useState } from 'react';
import createValidator from 'class-validator-formik';
import { Formik, Form as FormikForm } from 'formik';

import { buttonBase, buttonColor, Select, Option, Field } from '@components';
import { IENApplicantAddStatusDTO, formatDate, IENStatusReasonRO } from '@ien/common';
import {
  addMilestone,
  useGetMilestoneOptions,
  useGetWithdrawReasonOptions,
  MilestoneType,
  getJobAndMilestones,
} from '@services';
import addIcon from '@assets/img/add.svg';
import calendarIcon from '@assets/img/calendar.svg';
import dayjs from 'dayjs';

//@todo change any type
const initialValues: IENApplicantAddStatusDTO = {
  status: '',
  job_id: '',
  added_by: '',
  start_date: dayjs().format('YYYY-MM-DD'),
  notes: '',
  reason: '',
  effective_date: dayjs().format('YYYY-MM-DD'),
};

const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

interface AddMilestoneProps {
  applicantId: string;
  jobId: string;
  setJobMilestones: any;
}

// Add milestone comp ***
export const AddMilestones: React.FC<AddMilestoneProps> = ({
  applicantId,
  jobId,
  setJobMilestones,
}) => {
  const handleSubmit = async (values: any, { resetForm }: any) => {
    // hardcoding some values for now, specifically logged in user
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
    resetForm(initialValues);
  };

  return <MilestoneForm buttonText='Add Milestone' handleSubmit={handleSubmit} />;
};

interface EditMilestoneProps {
  milestones: any;
}

// Edit milestone comp *** currently unsure if this will be included moving forward
export const EditMilestones: React.FC<EditMilestoneProps> = milestones => {
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = async (values: any) => {
    // @todo hook up endpoint and remove log
    // eslint-disable-next-line no-console
    console.log('record values: ', values);
  };

  return (
    <>
      {!isEdit ? (
        <div className='border border-gray-200 rounded bg-gray-200 my-2 px-3 pb-4'>
          <div className='w-full pt-4'>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-black capitalize'>
                {milestones.milestones.status.status} |{' '}
                <img
                  src={calendarIcon.src}
                  alt='calendar'
                  className='inline-block mr-1'
                  width={13}
                  height={13}
                />
                {formatDate(milestones.milestones.start_date)}
              </span>
            </div>
            <span className='text-xs text-black'>
              {milestones.milestones.notes ? milestones.milestones.notes : 'No Notes Added'}
            </span>
          </div>
        </div>
      ) : (
        <>
          <MilestoneForm buttonText='Save Changes' handleSubmit={handleSubmit} />
          {/* will remove this button, easier testing purposes */}
          <button onClick={() => setIsEdit(false)} type='button'>
            Close
          </button>
        </>
      )}
    </>
  );
};

interface MilestoneFormProps {
  buttonText: string;
  handleSubmit: (values: IENApplicantAddStatusDTO, { resetForm }: any) => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ buttonText, handleSubmit }) => {
  const milestones = useGetMilestoneOptions();
  const reasons = useGetWithdrawReasonOptions();

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={milestoneValidator}>
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
                      <button
                        className={`border border-bcGray rounded text-bcGray ${buttonBase} pointer-events-none`}
                      >
                        <span className='whitespace-nowrap px-1 text-bcGray text-xs'>
                          Add New Reason
                        </span>
                        <img src={addIcon.src} alt='add reason' />
                      </button>
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
                className={`px-6 ${buttonColor.secondary} ${buttonBase}`}
                disabled={!dirty || !isValid}
                type='submit'
              >
                <img src={addIcon.src} alt='add' className='mr-2' />
                {buttonText}
              </button>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
