import axios from 'axios';
import { DeepPartial, SubmissionType } from 'src/components/submission/validation';

export const submitForm = async (submission: DeepPartial<SubmissionType>) => {
  // @todo when the form is fully implemented this object should be of type FormDTO
  const submissionData = {
    payload: submission,
    version: 'v1',
  };
  return await axios.post(`/submission`, submissionData);
};
