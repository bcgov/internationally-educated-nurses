import { useState } from 'react';
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
import { IENApplicantAddStatusDTO, formatDate, IENStatusReasonRO } from '@ien/common';
import {
  addMilestone,
  getJobAndMilestone,
  useGetMilestoneOptions,
  useGetWithdrawReasonOptions,
  MilestoneType,
} from '@services';

const initialValues: any = {
  status: '',
  job_id: '',
  added_by: '',
  start_date: new Date(),
  end_date: undefined,
  notes: '',
  reason: '',
  effective_date: undefined,
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

    const data = await addMilestone(applicantId as string, values);

    // get updated milestones
    if (data && data.id) {
      const reFetchData = await getJobAndMilestone(applicantId, jobId);

      if (reFetchData) {
        setJobMilestones(reFetchData.status_audit);
      }
    }

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

// Edit milestone comp *** currently unsure if this will be included moving forward
export const EditMilestones: React.FC<EditMilestoneProps> = milestones => {
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = async (values: any) => {
    // @todo hook up endpoint and remove log
    // eslint-disable-next-line no-console
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
              <span className='text-sm font-bold text-black capitalize'>
                {milestones.milestones.status.status} |{' '}
                <FontAwesomeIcon icon={faCalendar} className='h-3 inline-block mr-2' />
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
  handleSubmit: (values: IENApplicantAddStatusDTO, { resetForm }: any) => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ buttonText, icon, handleSubmit }) => {
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
                        <FontAwesomeIcon className='h-4 mr-2' icon={faPlusCircle} />
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
