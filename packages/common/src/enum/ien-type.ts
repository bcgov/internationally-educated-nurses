import { STATUS, STREAM_TYPE_MILESTONES } from './milestone-status';

export enum IenType {
  RN = 'RN',
  RPN = 'RPN',
  LPN = 'LPN',
  HCA = 'HCA',
}

export const IenTypes = [IenType.RN, IenType.RPN, IenType.LPN, IenType.HCA] as const;

export const getIenTypeByLicense = (
  licenseStatus: typeof STREAM_TYPE_MILESTONES[number],
): IenType | '' => {
  switch (licenseStatus) {
    case STATUS.REGISTERED_AS_AN_HCA:
      return IenType.HCA;
    case STATUS.BCCNM_FULL_LICENCE_LPN:
    case STATUS.BCCNM_PROVISIONAL_LICENSE_LPN:
      return IenType.LPN;
    case STATUS.BCCNM_FULL_LICENSE_RN:
    case STATUS.BCCNM_PROVISIONAL_LICENSE_RN:
      return IenType.RN;
  }
  return '';
};
