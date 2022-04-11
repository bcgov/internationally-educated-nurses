import axios from 'axios';
import { toast } from 'react-toastify';
import useSWRImmutable from 'swr/immutable';

const fetcher = (url: string) =>
  axios
    .get(url)
    .then(res => res.data)
    .catch(error =>
      toast.error(`${error.response.data.errorType}: ${error.response.data.errorMessage}`),
    );

export interface RecordTypeOptions {
  id: string;
  title: string;
}

export interface RecordType {
  haPcn: { data: RecordTypeOptions[] };
  jobTitle: { data: RecordTypeOptions[] };
  jobLocation: { data: RecordTypeOptions[] };
}

// get record options for adding new record modal
export const getAddRecordOptions = (): RecordType => {
  const { data: haPcn } = useSWRImmutable('ienmaster/ha-pcn', fetcher);
  const { data: jobLocation } = useSWRImmutable('ienmaster/job-locations', fetcher);
  const { data: jobTitle } = useSWRImmutable('ienmaster/job-titles', fetcher);

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
export const getMilestoneOptions = (): MilestoneType => {
  const { data: milestones } = useSWRImmutable('ienmaster/status', fetcher);

  return milestones?.data.filter((item: { id: number }) => item.id == 10003)[0].children;
};
