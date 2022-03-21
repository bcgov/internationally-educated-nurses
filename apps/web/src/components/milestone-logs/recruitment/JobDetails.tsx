import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AddMilestones, EditMilestones } from './Milestone';
import { Button } from 'src/components/Button';

export const JobDetails: React.FC = () => {
  return (
    <>
      <EditMilestones />
      <AddMilestones />
      <Button variant='primary' type='button'>
        <FontAwesomeIcon className='h-4 mr-2' icon={faCheck}></FontAwesomeIcon>
        Competition Outcome
      </Button>
    </>
  );
};
