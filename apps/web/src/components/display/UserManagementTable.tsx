import { useState } from 'react';
import { toast } from 'react-toastify';

import { EmployeeRO, formatDate, ValidRoles } from '@ien/common';
import { activateUser, revokeAccess, updateRole } from '@services';
import { Button } from '@components';
import { Spinner } from '../Spinner';
import { SortButton } from '../SortButton';
import { ChangeRoleModal } from '../user-management/ChangeRoleModal';

export interface UserManagementProps {
  employees: EmployeeRO[];
  loading: boolean;
  updateUser: (user: EmployeeRO) => void;
  onSortChange: (field: string) => void;
}

export const UserManagementTable = (props: UserManagementProps) => {
  const { employees, loading, onSortChange, updateUser } = props;

  const [selectedUser, setSelectedUser] = useState<EmployeeRO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const openModal = (user: EmployeeRO) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const changeRole = async (user: EmployeeRO, role: ValidRoles | string) => {
    const res = await updateRole(user.id, role as ValidRoles);
    if (res) {
      updateUser({ ...user, role });
      toast.success('User role was successfully updated');
    }
    setModalOpen(false);
  };

  const revoke = async (user: EmployeeRO) => {
    const res = await revokeAccess(user.id);
    if (res) {
      updateUser(res);
    }
    toast.success('User access has been revoked.');
    setModalOpen(false);
  };

  const activate = async (user: EmployeeRO, index: number) => {
    setLoadingIndex(index);
    const res = await activateUser(user.id);
    if (res) {
      updateUser(res);
      toast.success('User has been activated.');
    }
    setLoadingIndex(-1);
  };

  const getStatus = (user: EmployeeRO) => {
    if (user.role === ValidRoles.PENDING) return 'None';
    if (user.revoked_access_date) return 'Revoked';
    return 'Active';
  };

  const getStatusClass = (user: EmployeeRO): string => {
    if (user.role === ValidRoles.PENDING) return '';
    if (user.revoked_access_date) return 'text-bcRedError';
    return 'text-bcGreenSuccess';
  };

  const getButton = (employee: EmployeeRO, index: number) => {
    if (employee.role === ValidRoles.ROLEADMIN) return '';
    const revoked = employee.revoked_access_date;
    if (loadingIndex === index) {
      return <Spinner className='h-8 ml-12' relative />;
    }
    return (
      <Button
        variant='outline'
        className='border-bcGray text-bcGray w-32'
        onClick={() => (revoked ? activate(employee, index) : openModal(employee))}
      >
        {revoked ? 'Activate' : 'Change Role'}
      </Button>
    );
  };

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='px-6 py-4' scope='col'>
              <SortButton label='Name' sortKey='name' onChange={onSortChange} />
            </th>
            <th className='px-6'>Email Address</th>
            <th className='px-6' scope='col'>
              <SortButton label='Created On' sortKey='createdDate' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              <SortButton label='Role' sortKey='role' onChange={onSortChange} />
            </th>
            <th className='px-6 text-center' scope='col'>
              Status
            </th>
            <th className='' scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {loading ? (
            <tr className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm'>
              <td colSpan={4} className='h-64'>
                <Spinner className='h-10' relative />
              </td>
            </tr>
          ) : (
            employees.map((employee: EmployeeRO, index) => (
              <tr
                key={employee.id}
                className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm '
              >
                <td className='pl-6 py-5'>{employee.name}</td>
                <td className='px-6'>{employee.email}</td>
                <td className='px-6'>{employee.createdDate && formatDate(employee.createdDate)}</td>
                <td className='px-6'>{employee.role.toUpperCase()}</td>
                <td className={`px-6 text-center ${getStatusClass(employee)}`}>
                  {getStatus(employee)}
                </td>
                <td className='px-6 text-right'>{getButton(employee, index)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ChangeRoleModal
        open={modalOpen}
        user={selectedUser}
        submit={changeRole}
        revoke={revoke}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};
