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
  currentTab: number;
  setCurrentTab: (index: number) => void;
  updateJob: (job: ApplicantJobRO) => void;
}>({
  setCurrentTab: () => void 0,
  updateJob: () => void 0,
  applicant: {} as ApplicantRO,
  milestones: [],
  currentTab: 0,
});

export const ApplicantProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const router = useRouter();
  const id = router.query.id as string;

  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [applicant, setApplicant] = useState<ApplicantRO>({} as ApplicantRO);
  const [milestones, setMilestones] = useState<ApplicantStatusAuditRO[]>([]);

  useEffect(() => {
    const audits =
      applicant?.applicant_status_audit?.filter(audit => {
        return audit.status.parent?.id === 10000 + currentTab;
      }) || [];
    setMilestones(audits);
  }, [applicant, currentTab]);

  const selectDefaultLandingTab = (status_id?: number) => {
    if (currentTab) return;
    const index = status_id ? +`${status_id}`.charAt(0) : 1;
    if (index !== currentTab) {
      setCurrentTab(index);
    }
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

  const fetchApplicant = async (id: string) => {
    setLoading(true);
    const applicantData = await getApplicant(id);
    if (applicantData) {
      setApplicant(applicantData);
    }
    selectDefaultLandingTab(applicantData?.status?.id);

    setLoading(false);
  };

  useEffect(() => {
    fetchApplicant(id);
  }, []);

  const value = {
    applicant,
    milestones,
    currentTab,
    setCurrentTab,
    updateJob,
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
