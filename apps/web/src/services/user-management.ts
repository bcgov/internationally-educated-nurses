import { EmployeeFilterDTO, EmployeeRO, ValidRoles } from '@ien/common';
import axios from 'axios';

// get all employees
export const getEmployees = async (
  filter: EmployeeFilterDTO = {},
): Promise<[EmployeeRO[], number] | undefined> => {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(parameter => {
    Array.isArray(parameter[1])
      ? parameter[0] &&
        parameter[1].length > 0 &&
        params.append(parameter[0], parameter[1].toString())
      : parameter[0] && parameter[1] && params.append(parameter[0], parameter[1].toString());
  });
  try {
    const { data } = await axios.get<{ data: [EmployeeRO[], number] }>(
      `/employee/list/all?${params.toString()}`,
    );
    return data?.data;
  } catch (e) {
    return undefined;
  }
};

export const updateRole = async (id: string, role: ValidRoles): Promise<boolean> => {
  try {
    await axios.patch('/employee/update/role', { ids: [id], role });
    return true;
  } catch (e) {
    return false;
  }
};

export const revokeAccess = async (id: string): Promise<EmployeeRO | null> => {
  try {
    const { data } = await axios.patch('/employee/revoke', { id });
    return data.data;
  } catch (e) {
    return null;
  }
};

export const activateUser = async (id: string): Promise<EmployeeRO | null> => {
  try {
    const { data } = await axios.patch<{ data: EmployeeRO }>('/employee/activate', { id });
    return data.data;
  } catch (e) {
    return null;
  }
};
