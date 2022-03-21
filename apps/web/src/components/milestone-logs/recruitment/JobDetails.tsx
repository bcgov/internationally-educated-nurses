import { useRouter } from 'next/router';
import { faCheck, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { buttonBase, buttonColor } from '@components';
import { DetailsItem } from 'src/components/DetailsItem';
import { AddMilestones, EditMilestones } from './Milestone';
import { Button } from 'src/components/Button';

export const JobDetails: React.FC = () => {
  const router = useRouter();
  const applicantId = router.query.applicantId;

  return (
    <div className='px-5 mb-3'>
      <div className='flex justify-between'>
        <DetailsItem title='Job ID' text='ABC1234' />
        <DetailsItem title='Location' text='Surrey Memorial hospital' />

        <DetailsItem title='Recruiter Name' text='Jenny Wilson' />
        <DetailsItem title='Date Job Was First Posted' text='Nov 24, 2019' />
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
      <EditMilestones />
      <AddMilestones />
      <Button variant='primary' type='button'>
        <FontAwesomeIcon className='h-4 mr-2' icon={faCheck}></FontAwesomeIcon>
        Competition Outcome
      </Button>
    </div>
  );
};
