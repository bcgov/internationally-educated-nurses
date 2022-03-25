import {
  faCalendar,
  faPencilAlt,
  faPlusCircle,
  faTrash,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import createValidator from 'class-validator-formik';
import { Formik, Form as FormikForm } from 'formik';

import { buttonBase, buttonColor, Select, Option, Field } from '@components';
import { useEffect, useState } from 'react';
import { IENApplicantAddStatusDTO } from '@ien/common';
import { addMilestone, milestoneRecruitmentOptions } from '@services';
import { formatDate } from '@ien/common/src';

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
  applicantId: string | string[] | undefined;
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
    // no access to id for job adding through IENApplicantAddStatusDTO,
    //hardcoding unknown values at this time
    values.job_id = jobId.toString();
    values.added_by = '1';
    console.log(values);
    const {
      data: { data },
    } = await addMilestone(applicantId as string, values);
    setJobMilestones([data, ...jobMilestones]);

    // reset form after submitting
    resetForm(initialValues);
  };

  return (
    <MilestoneForm buttonText='Add Milestone' icon={faPlusCircle} handleSubmit={handleSubmit} />
  );
};

interface EditMilestoneProps {
  milestones: any;
}

// Edit milestone comp ***
export const EditMilestones: React.FC<EditMilestoneProps> = milestones => {
  console.log('milestones: ', milestones);
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = async (values: any) => {
    // @todo hook up endpoint and remove log
    console.log('record values: ', values);
  };

  const onEditClick = () => {
    setIsEdit(true);
  };

  return (
    <>
      {!isEdit ? (
        <div className='border border-gray-200 rounded bg-gray-200 my-2 px-3 pb-4'>
          <div className='w-full pt-4'>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-black'>
                {milestones.milestones.status.status} |{' '}
                <FontAwesomeIcon icon={faCalendar} className='h-3.5 inline-block mr-2' />
                {formatDate(milestones.milestones.start_date)}
              </span>
              <span className='mr-3 ml-auto'>
                <button onClick={onEditClick} type='button'>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className='text-bcBluePrimary h-4 inline-block mr-3'
                  />
                </button>
                <button>
                  <FontAwesomeIcon icon={faTrash} className='text-red-500 h-4 inline-block' />
                </button>
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
  icon?: IconDefinition;
  handleSubmit: (values: any, { resetForm }: any) => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ buttonText, icon, handleSubmit }) => {
  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={milestoneValidator}>
          {({ dirty, isValid }) => (
            <FormikForm>
              <div className='flex justify-between mb-4'>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Select name='status' label='Milestone'>
                    {milestoneRecruitmentOptions.map(opt => (
                      <Option key={opt.value} label={opt.label} value={opt.value} />
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
                {icon ? <FontAwesomeIcon className='h-4 mr-2' icon={icon}></FontAwesomeIcon> : null}
                {buttonText}
              </button>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
