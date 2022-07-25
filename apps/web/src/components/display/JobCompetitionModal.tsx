import { ApplicantJobRO } from '@ien/common';
import { Button } from '../Button';
import { DetailsItem } from '../DetailsItem';
import { Modal } from '../Modal';

interface JobCompetitionProps {
  onClose: () => void;
  visible: boolean;
  job: ApplicantJobRO | undefined;
}

const getText = (text?: string) => {
  return text || 'N/A';
};

export const JobCompetitionModal: React.FC<JobCompetitionProps> = (props: JobCompetitionProps) => {
  const { visible, onClose, job } = props;

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Job Competition Information
      </Modal.Title>
      <div className='w-full pl-4 py-5 border-b-2'>
        <DetailsItem
          title={getText(job?.ha_pcn.title)}
          text={`${getText(job?.job_title?.title)} | Recruiter Name: ${job?.recruiter_name}`}
        />
        <DetailsItem title='Job ID' text={getText(job?.job_id)} />
        <DetailsItem title='Location' text={getText(job?.job_location?.[0]?.title)} />
        <DetailsItem title='Recruiter Name' text={job?.recruiter_name} />
      </div>
      <div className='flex justify-center my-5'>
        <Button variant='primary' onClick={onClose} forModal>
          Close
        </Button>
      </div>
    </Modal>
  );
};
