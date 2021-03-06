import useSWRImmutable from 'swr/immutable';

import { IENStatusReasonRO } from '@ien/common';
import { fetcher } from '../utils';
import { StyleOption } from './constants/roles.constants';

export interface RecordTypeOptions extends StyleOption {
  id: number;
  countryCode?: string;
  title: string;
}

export interface RecordType {
  haPcn: { data: RecordTypeOptions[] };
  jobTitle: { data: RecordTypeOptions[] };
  jobLocation: { data: RecordTypeOptions[] };
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
export const useGetMilestoneOptions = (statusId: number): MilestoneType[] => {
  const { data: milestones } = useSWRImmutable('ienmaster/status', fetcher);
  return milestones?.data.filter((item: { id: number }) => item.id == statusId)[0]?.children;
};

export const useGetWithdrawReasonOptions = (): IENStatusReasonRO[] => {
  const { data: reasons } = useSWRImmutable('ienmaster/reasons', fetcher);
  return reasons?.data;
};

export const useGetEducationOptions = (): RecordTypeOptions[] => {
  const { data: education } = useSWRImmutable('ienmaster/education', fetcher);
  return education?.data;
};
