import axios from 'axios';

export interface RecordTypeOptions {
  id: string;
  title: string;
}

export interface RecordType {
  haPcn: RecordTypeOptions[];
  jobTitle: RecordTypeOptions[];
  jobLocation: RecordTypeOptions[];
}

// record options for adding a new record
export const getAddRecordOptions = async (): Promise<RecordType> => {
  const data = await axios.all([
    await axios.get(`ienmaster/ha-pcn`),
    await axios.get(`ienmaster/job-titles`),
    await axios.get(`ienmaster/job-locations`),
  ]);

  const [haPcn, jobTitle, jobLocation] = data;

  return {
    haPcn: haPcn?.data?.data,
    jobTitle: jobTitle?.data?.data,
    jobLocation: jobLocation?.data?.data,
  };
};

export interface MilestoneType {
  id: string;
  status: string;
}

// milestone status' for adding milestones
export const getMilestoneOptions = async (): Promise<MilestoneType[]> => {
  const {
    data: { data },
  } = await axios.get('ienmaster/status');

  return data.filter((item: { id: number }) => item.id == 10003)[0].children;
};
