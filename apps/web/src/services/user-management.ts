import { EmployeeFilterDTO, EmployeeRO, Role } from '@ien/common';
import axios from 'axios';
import { fetcher } from '../utils';
import useSWRImmutable from 'swr/immutable';

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
    const response = await axios.get<{ data: [EmployeeRO[], number] }>(
      `/employee/list/all?${params.toString()}`,
    );
    return response?.data?.data;
  } catch (e) {
    return undefined;
  }
};

export const getEmployee = async (id?: string): Promise<EmployeeRO> => {
  const response = await axios.get<{ data: EmployeeRO }>(id ? `/employee/${id}` : '/employee');
  return response?.data?.data;
};

export const updateRoles = async (
  id: string,
  role_ids: number[],
): Promise<EmployeeRO | undefined> => {
  try {
    const { data } = await axios.patch('/employee/update/role', { id, role_ids });
    return data?.data;
  } catch (e) {
    return undefined;
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

export const useRoles = (): Role[] | undefined => {
  const { data } = useSWRImmutable('employee/list/roles', fetcher);
  return data?.data;
};
