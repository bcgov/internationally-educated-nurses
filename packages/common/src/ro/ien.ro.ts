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
  id: string;
  title: string;
  abbreviation?: string;
  description?: string;
  referral_date?: Date;
}

export interface IENJobTitleRO {
  id: string;
  title: string;
}

export interface IENJobLocationRO {
  id: number;
  title: string;
  ha_pcn: IENHaPcnRO;
}

export interface IENStatusReasonRO {
  id: string;
  name?: string | null;
}

export interface IENEducationRO {
  id: number;
  title: string;
}
