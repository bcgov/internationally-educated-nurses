import { useState } from 'react';
import createValidator from 'class-validator-formik';
import { Formik, Form as FormikForm } from 'formik';

import { buttonBase, buttonColor, Select, Option, Field } from '@components';
import { IENApplicantAddStatusDTO, formatDate } from '@ien/common';
import { addMilestone, getMilestoneOptions, MilestoneType } from '@services';
import addIcon from '@assets/img/add.svg';
import calendarIcon from '@assets/img/calendar.svg';

//@todo change any type
const initialValues: IENApplicantAddStatusDTO = {
  status: '',
  job_id: '',
  added_by: '',
  start_date: new Date(),
  end_date: undefined,
  notes: '',
};

const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

interface AddMilestoneProps {
  applicantId: string;
  jobId: string;
  jobMilestones: any;
  setJobMilestones: any;
}

// Add milestone comp ***
export const AddMilestones: React.FC<AddMilestoneProps> = ({
  applicantId,
  jobId,
  jobMilestones,
  setJobMilestones,
}) => {
  const handleSubmit = async (values: any, { resetForm }: any) => {
    // hardcoding some values for now, specifically logged in user
    values.job_id = jobId.toString();
    values.added_by = '1';

    const data = await addMilestone(applicantId as string, values);

    if (data) {
      setJobMilestones([...jobMilestones, data]);
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
  const milestones = getMilestoneOptions();

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={milestoneValidator}>
          {({ dirty, isValid }) => (
            <FormikForm>
              <div className='flex justify-between mb-4'>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Select name='status' label='Milestone'>
                    {milestones &&
                      milestones.length > 0 &&
                      milestones.map((opt: MilestoneType) => (
                        <Option key={opt.id} label={opt.status} value={opt.id} />
                      ))}
                  </Select>
                </span>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Field name='start_date' label='Date' type='date' />
                </span>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Field name='notes' label='Note' type='text' />
                </span>
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
