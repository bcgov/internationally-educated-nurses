import { Disclosure } from '@components';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JobDetails } from './JobDetails';

export const Record: React.FC = () => {
  return (
    <div className='mb-3'>
      <Disclosure
        buttonText={
          <div className='bg-blue-100 rounded py-2 pl-5 w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black'>Fraser Health</span>
              <span className='text-xs text-green-500 font-bold mr-3 ml-auto'>
                <FontAwesomeIcon
                  icon={faCircle}
                  className='text-green-500 h-2 inline-block mb-0.5 mr-1'
                />
                Offer was accepted
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-black '>Nurse Practitioner</span>
              <span className='text-xs text-black mr-3'>1 month</span>
            </div>
          </div>
        }
        content={<JobDetails />}
      />
    </div>
  );
};
