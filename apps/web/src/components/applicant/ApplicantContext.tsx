import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ApplicantRO, ApplicantStatusAuditRO, ApplicantJobRO, isHired } from '@ien/common';
import { getApplicant } from '@services';
import { Spinner } from '../Spinner';
import { useRouter } from 'next/router';
import { useAuthContext } from '../AuthContexts';

export const ApplicantContext = createContext<{
  applicant: ApplicantRO;
  milestones: ApplicantStatusAuditRO[];
  hiredHa: number | undefined;
  updateJob: (job: ApplicantJobRO) => void;
  deleteMilestone: (milestoneId: string, jobId: string) => void;
  fetchApplicant: () => void;
}>({
  updateJob: () => void 0,
  deleteMilestone: () => void 0,
  fetchApplicant: () => void 0,
  applicant: {} as ApplicantRO,
  milestones: [],
  hiredHa: undefined,
});

export const ApplicantProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const router = useRouter();
  const id = router.query.id as string;

  const { authUser } = useAuthContext();

  if (!id) {
    router.replace('/applicants');
  }

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplicantRO>({} as ApplicantRO);
  const [milestones, setMilestones] = useState<ApplicantStatusAuditRO[]>([]);
  const [hiredHa, setHiredHa] = useState<number>();

  const sortMilestones = (audits: ApplicantStatusAuditRO[]): ApplicantStatusAuditRO[] => {
    return audits.sort((a, b) => {
      if ((a.start_date || 0) > (b.start_date || 0)) return 1;
      if (a.start_date === b.start_date) {
        if (a.id > b.id) return 1;
        if (a.id === b.id) return 0;
        return -1;
      }
      return -1;
    });
  };

  // check if there is an accepted offer in any job
  const checkForAcceptedOffer = (jobs: ApplicantJobRO[] | null | undefined) => {
    const acceptedOffer = jobs && jobs.find(j => j.status_audit?.find(s => isHired(s.status.id)));

    acceptedOffer ? setHiredHa(acceptedOffer.ha_pcn.id) : setHiredHa(undefined);
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
    checkForAcceptedOffer(applicant.jobs);
    setApplicant({ ...applicant });
  };

  const deleteMilestone = (milestoneId: string, jobId: string) => {
    const job = applicant.jobs?.find(j => jobId === j.id);
    if (job && job.status_audit) {
      const toDelete = job.status_audit?.findIndex(m => m.id === milestoneId);

      if (toDelete !== undefined && toDelete >= 0) {
        job.status_audit?.splice(toDelete, 1);
      }
      checkForAcceptedOffer(applicant.jobs);
      setApplicant({ ...applicant });
    }
  };

  const fetchApplicant = async () => {
    if (!id) return;

    setLoading(true);
    const applicantData = await getApplicant(id);

    if (applicantData) {
      checkForAcceptedOffer(applicantData.jobs);

      const filteredJobs = authUser?.ha_pcn_id
        ? applicantData.jobs?.filter(j => j.ha_pcn.id === authUser?.ha_pcn_id)
        : applicantData.jobs;

      setApplicant({ ...applicantData, jobs: filteredJobs });
      setMilestones(sortMilestones(applicantData.applicant_status_audit || []));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApplicant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    applicant,
    milestones,
    hiredHa,
    updateJob,
    deleteMilestone,
    fetchApplicant,
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
