import axios from 'axios';

export const getAddRecordOptions = async () => {
  const data = await axios.all([
    await axios.get(`ienmaster/ha-pcn`),
    await axios.get(`ienmaster/job-titles`),
    await axios.get(`ienmaster/job-locations`),
  ]);

  return data;
};
