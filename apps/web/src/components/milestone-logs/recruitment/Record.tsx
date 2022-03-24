import { faCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { buttonBase, buttonColor, DetailsItem, Disclosure } from '@components';
import { JobDetails } from './JobDetails';

interface RecordProps {
  job: {
    ha_pcn: { title: string };
    job_id: string;
    job_location: { title: string };
    job_post_date: Date;
    job_title: { title: string };
    recruiter_name: string;
  };
}

export const Record: React.FC<RecordProps> = ({ job }) => {
  const router = useRouter();
  const applicantId = router.query.applicantId;
  const { ha_pcn, job_id, job_location, job_post_date, job_title, recruiter_name } = job;

  return (
    <div className='mb-3'>
      <Disclosure
        buttonText={
          <div className='bg-blue-100 rounded py-2 pl-5 w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black'>{ha_pcn.title}</span>
              <span className='text-xs text-green-500 font-bold mr-3 ml-auto'>
                <FontAwesomeIcon
                  icon={faCircle}
                  className='text-green-500 h-2 inline-block mb-0.5 mr-1'
                />
                Offer was accepted
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-black '>{job_title.title}</span>
              <span className='text-xs text-black mr-3'>1 month</span>
            </div>
          </div>
        }
        content={
          <div className='px-5 mb-3'>
            <div className='flex justify-between'>
              <DetailsItem title='Job ID' text={job_id} />
              <DetailsItem title='Location' text={job_location.title} />

              <DetailsItem title='Recruiter Name' text={recruiter_name} />
              <DetailsItem title='Date Job Was First Posted' text={job_post_date.toString()} />
            </div>
            <Link
              as={`/details/${applicantId}?recruitment=edit`}
              href={{
                pathname: `/details/${applicantId}`,
                query: { ...router.query, recruitment: 'edit' },
              }}
              shallow={true}
            >
              <a className={`px-6 mb-2 ${buttonColor.secondary} ${buttonBase} pointer-events-none`}>
                <FontAwesomeIcon className='h-4 mr-2' icon={faPencilAlt}></FontAwesomeIcon>
                Edit Details
              </a>
            </Link>
            <JobDetails />
          </div>
        }
      />
    </div>
  );
};
