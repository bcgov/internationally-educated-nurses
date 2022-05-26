import { EmployeeFilterDTO, EmployeeRO, ValidRoles } from '@ien/common';
import axios from 'axios';

// get all employees
export const getEmployees = async (filter: EmployeeFilterDTO = {}) => {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(parameter => {
    Array.isArray(parameter[1])
      ? parameter[0] &&
        parameter[1].length > 0 &&
        params.append(parameter[0], parameter[1].toString())
      : parameter[0] && parameter[1] && params.append(parameter[0], parameter[1].toString());
  });

  const response = await axios.get<{ data: [EmployeeRO[], number] }>(
    `/employee/list/all?${params.toString()}`,
  );

  const {
    data: [data, count],
  } = response.data;

  return { data, count };
};

export const updateRole = async (id: string, role: ValidRoles): Promise<boolean> => {
  try {
    await axios.patch('/employee/update/role', { ids: [id], role });
    return true;
  } catch (e) {
    return false;
  }
};
