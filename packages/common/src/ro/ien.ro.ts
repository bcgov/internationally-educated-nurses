import { StatusCategory } from '../enum';

export interface IENApplicantStatusRO {
  id: string;
  status: string;
  party?: string;
  category?: StatusCategory;
  parent?: IENApplicantStatusRO;
  children?: IENApplicantStatusRO[];
}

export interface IENUserRO {
  id: string;
  name: string;
  email?: string;
}

export interface IENHaPcnRO {
  id: number;
  title: string;
  abbreviation?: string;
  description?: string;
  referral_date?: Date;
}

export interface IENJobTitleRO {
  id: number;
  title: string;
}

export interface IENJobLocationRO {
  id: number;
  title: string;
  ha_pcn: IENHaPcnRO;
}

export interface IENStatusReasonRO {
  id: number;
  name?: string | null;
}

export interface IENEducationRO {
  id: number;
  title: string;
}
