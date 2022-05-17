import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ApplicantRO, ApplicantStatusAuditRO } from '@ien/common';
import { emitter, getApplicant, IEN_EVENTS } from '@services';
import { Spinner } from '../components/Spinner';
import { useRouter } from 'next/router';

export const ApplicantContext = createContext<{
  applicant: ApplicantRO | null;
  milestones: ApplicantStatusAuditRO[];
  currentTab: number;
  setCurrentTab: (index: number) => void;
}>({
  setCurrentTab: () => void 0,
  applicant: null,
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
    emitter.on(IEN_EVENTS.UPDATE_JOB, fetchApplicant);
    return () => {
      emitter.off(IEN_EVENTS.UPDATE_JOB, fetchApplicant);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { applicant, milestones, currentTab, setCurrentTab };
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
