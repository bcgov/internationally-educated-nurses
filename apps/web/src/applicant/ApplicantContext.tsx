import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ApplicantRO, ApplicantStatusAuditRO } from '@ien/common';
import { getApplicant } from '@services';
import { Spinner } from '../components/Spinner';
import { useRouter } from 'next/router';
import { ApplicantJobRO } from '@ien/common/src/ro/applicant.ro';

export const ApplicantContext = createContext<{
  applicant: ApplicantRO;
  milestones: ApplicantStatusAuditRO[];
  updateJob: (job: ApplicantJobRO) => void;
  deleteMilestone: (milestoneId: string, jobId: string) => void;
}>({
  updateJob: () => void 0,
  deleteMilestone: () => void 0,
  applicant: {} as ApplicantRO,
  milestones: [],
});

export const ApplicantProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplicantRO>({} as ApplicantRO);
  const [milestones, setMilestones] = useState<ApplicantStatusAuditRO[]>([]);

  const sortMilestones = (audits: ApplicantStatusAuditRO[]): ApplicantStatusAuditRO[] => {
    return audits.sort((a, b) => {
      return (a.start_date || 0) > (b.start_date || 0) ? 1 : -1;
    });
  };

  const updateJob = (job: ApplicantJobRO) => {
    const index = applicant.jobs?.findIndex(j => job.id === j.id);
    if (index === undefined) {
      applicant.jobs = [job];
    } else if (index >= 0) {
      applicant.jobs?.splice(index, 1, job);
    } else {
      applicant.jobs?.push(job);
    }
    setApplicant({ ...applicant });
  };

  const deleteMilestone = (milestoneId: string, jobId: string) => {
    const job = applicant.jobs?.find(j => jobId === j.id);
    if (job && job.status_audit) {
      const toDelete = job.status_audit?.findIndex(m => m.id === milestoneId);

      if (toDelete !== undefined && toDelete >= 0) {
        job.status_audit?.splice(toDelete, 1);
      }
      setApplicant({ ...applicant });
    }
  };

  const fetchApplicant = async (id: string) => {
    setLoading(true);
    const applicantData = await getApplicant(id);
    if (applicantData) {
      setApplicant(applicantData);
      setMilestones(sortMilestones(applicant.applicant_status_audit || []));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplicant(id);
  }, []);

  const value = {
    applicant,
    milestones,
    updateJob,
    deleteMilestone,
  };
  return (
    <ApplicantContext.Provider value={value}>
      {loading && !applicant.id ? <Spinner className='h-10' /> : children}
    </ApplicantContext.Provider>
  );
};

export const useApplicantContext = () => {
  const context = useContext(ApplicantContext);
  if (context === undefined) {
    throw Error('useApplicantContext must be used within ApplicantProvider');
  }
  return context;
};
