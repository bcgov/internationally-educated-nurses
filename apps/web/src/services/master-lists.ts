import useSWRImmutable from 'swr/immutable';

import { IENHaPcnRO, IENStatusReasonRO } from '@ien/common';
import { fetcher } from '../utils';
import { StyleOption } from './constants';

export interface RecordTypeOptions<T> extends StyleOption {
  id: T;
  countryCode?: string;
  title: string;
}

export interface RecordType {
  haPcn: { data: RecordTypeOptions<string>[] };
  jobTitle: { data: RecordTypeOptions<string>[] };
  jobLocation: { data: (RecordTypeOptions<number> & { ha_pcn: IENHaPcnRO })[] };
}

// get record options for adding new record modal
export const useGetAddRecordOptions = (): RecordType => {
  const { data: haPcn } = useSWRImmutable('ienmaster/ha-pcn', fetcher);
  const { data: jobLocation } = useSWRImmutable('ienmaster/job-locations', fetcher);
  const { data: jobTitle } = useSWRImmutable('ienmaster/job-titles', fetcher);

  return { haPcn, jobLocation, jobTitle };
};

export interface MilestoneType extends StyleOption {
  id: string;
  status: string;
}

// milestone status' for adding milestones
export const useGetMilestoneOptions = (categoryId: string): MilestoneType[] => {
  const { data } = useSWRImmutable('ienmaster/status', fetcher);
  const milestones: MilestoneType[] = data?.data?.filter(
    (item: { category: string }) => item.category == categoryId,
  );
  if (milestones) {
    return milestones.sort((a, b) => (a.id > b.id ? 1 : -1));
  }
  return [];
};

export const useGetWithdrawReasonOptions = (): IENStatusReasonRO[] => {
  const { data: reasons } = useSWRImmutable('ienmaster/reasons', fetcher);
  return reasons?.data;
};

export const useGetEducationOptions = (): RecordTypeOptions<number>[] => {
  const { data: education } = useSWRImmutable('ienmaster/education', fetcher);
  return education?.data;
};
