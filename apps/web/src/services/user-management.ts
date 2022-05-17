import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const notifyError = (e: AxiosError) => {
  toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
};

// get all employees
export const getEmployees = async (name?: string) => {
  try {
    const params = new URLSearchParams();

    // need to create filter object for here
    name && params.append('name', name);

    const response = await axios.get<any>(`/employee/list/all?${params.toString()}`);

    const { data } = response.data;

    return { data };
  } catch (e) {
    notifyError(e as AxiosError);
  }
};
