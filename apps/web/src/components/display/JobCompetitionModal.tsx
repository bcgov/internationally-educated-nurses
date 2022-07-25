import { ApplicantJobRO } from '@ien/common';
import { Button } from '../Button';
import { DetailsItem } from '../DetailsItem';
import { Modal } from '../Modal';

interface JobCompetitionProps {
  onClose: () => void;
  visible: boolean;
  job: ApplicantJobRO | undefined;
}

export const JobCompetitionModal: React.FC<JobCompetitionProps> = (props: JobCompetitionProps) => {
  const { visible, onClose, job } = props;

  const jobTitle = job?.ha_pcn.title || 'N/A';
  const jobRecruiterName = job?.recruiter_name || 'N/A';
  const jobId = job?.job_id || 'N/A';
  const jobLocation = job?.job_location?.[0]?.title || 'N/A';

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Job Competition Information
      </Modal.Title>
      <div className='w-full pl-4 py-5 border-b-2'>
        <DetailsItem title={jobTitle} text={`${jobTitle} | Recruiter Name: ${jobRecruiterName}`} />
        <DetailsItem title='Job ID' text={jobId} />
        <DetailsItem title='Location' text={jobLocation} />
        <DetailsItem title='Recruiter Name' text={jobRecruiterName} />
      </div>
      <div className='flex justify-center my-5'>
        <Button variant='primary' onClick={onClose} forModal>
          Close
        </Button>
      </div>
    </Modal>
  );
};
