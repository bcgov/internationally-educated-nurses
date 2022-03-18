import {
  faCalendar,
  faPencilAlt,
  faPlusCircle,
  faTrash,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { buttonBase, buttonColor, Select, Option, Field } from '@components';
import { Formik, Form as FormikForm } from 'formik';
import { useState } from 'react';

//@todo change any type
const initialValues: any = {
  milestone: '',
  date: '2022-03-10',
  note: '',
};

// fake array values for Select options, temporary
const fakeArrayT = [
  { value: '1', label: 'Prescreen Completed' },
  { value: '2', label: 'Interview Completed' },
  { value: '3', label: 'References Completed' },
  { value: '4', label: 'Offered Position' },
];

// Add milestone comp ***
export const AddMilestones: React.FC = () => {
  const handleSubmit = async (values: any) => {
    // @todo hook up endpoint and remove log
    console.log('record values: ', values);
  };

  return (
    <MilestoneForm buttonText='Add Milestone' icon={faPlusCircle} handleSubmit={handleSubmit} />
  );
};

// Edit milestone comp ***
export const EditMilestones: React.FC = () => {
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
                Prescreen Completed |{' '}
                <FontAwesomeIcon icon={faCalendar} className='h-3.5 inline-block mr-2' />
                Feb 1, 2022
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
              This participant has the acknowledge reviewed and passed
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
  handleSubmit: (values: any) => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ buttonText, icon, handleSubmit }) => {
  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ dirty, isValid }) => (
            <FormikForm>
              <div className='flex justify-between mb-4'>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Select name='milestone' label='Milestone'>
                    {fakeArrayT.map(opt => (
                      <Option key={opt.value} label={opt.label} value={opt.value} />
                    ))}
                  </Select>
                </span>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Field name='date' label='Date' type='date' />
                </span>
                <span className='flex-grow pr-1 md:pr-2'>
                  <Field name='note' label='Note' type='text' />
                </span>
              </div>
              <button
                className={`px-6 ${buttonColor.secondary} ${buttonBase} pointer-events-none`}
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
