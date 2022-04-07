import axios from 'axios';
import { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';

export interface RecordTypeOptions {
  id: string;
  title: string;
}

export interface RecordType {
  haPcn: { data: RecordTypeOptions[] };
  jobTitle: { data: RecordTypeOptions[] };
  jobLocation: { data: RecordTypeOptions[] };
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const getAddRecordOptions = (): RecordType => {
  const { data: haPcn, error: haPcnError } = useSWRImmutable('ienmaster/ha-pcn', fetcher);
  const { data: jobLocation, error: jobLocationError } = useSWRImmutable(
    'ienmaster/job-locations',
    fetcher,
  );
  const { data: jobTitle, error: jobTitleError } = useSWRImmutable('ienmaster/job-titles', fetcher);

  return { haPcn, jobLocation, jobTitle };
};

export interface MilestoneTypeOptions {
  id: string;
  status: string;
}

export interface MilestoneType {
  milestones: MilestoneTypeOptions[];
}

// milestone status' for adding milestones
export const getMilestoneOptions = (): any => {
  const { data: milestones, error } = useSWRImmutable('ienmaster/status', fetcher);

  return milestones?.data;
};
