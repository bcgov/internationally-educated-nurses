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
export const getAddRecordOptions = async () => {
  const data = await axios.all([
    await axios.get(`ienmaster/ha-pcn`),
    await axios.get(`ienmaster/job-titles`),
    await axios.get(`ienmaster/job-locations`),
  ]);

  return data;
};

export interface MilestoneTypeOptions {
  id: string;
  status: string;
}

export interface MilestoneType {
  status: MilestoneTypeOptions[];
}

// milestone status' for adding milestones
export const getMilestoneOptions = async () => {
  const {
    data: { data },
  } = await axios.get('ienmaster/status');

  return data[2].children;
};
