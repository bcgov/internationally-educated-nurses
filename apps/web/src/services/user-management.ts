import { EmployeeFilterDTO, EmployeeRO } from '@ien/common';
import axios from 'axios';

// get all employees
export const getEmployees = async (filter: EmployeeFilterDTO = {}) => {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(parameter => {
    parameter[0] && parameter[1] && params.append(parameter[0], parameter[1].toString());
  });

  const response = await axios.get<{ data: [EmployeeRO[], number] }>(
    `/employee/list/all?${params.toString()}`,
  );

  const {
    data: [data, count],
  } = response.data;

  return { data, count };
};
