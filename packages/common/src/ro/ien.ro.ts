export interface IENApplicantStatusRO {
  id: number;
  status: string;
  parent?: IENApplicantStatusRO;
  children?: IENApplicantStatusRO[];
}

export interface IENUserRO {
  id: number;
  name: string;
  user_id?: string;
  created_date?: Date;
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
}

export interface IENStatusReasonRO {
  id: number;
  name?: string | null;
}

export interface IENEducationRO {
  id: number;
  title: string;
}