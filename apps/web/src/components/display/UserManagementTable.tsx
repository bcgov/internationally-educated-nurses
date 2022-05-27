import { EmployeeRO, formatDate, ValidRoles } from '@ien/common';
import { Spinner } from '../Spinner';
import { SortButton } from '../SortButton';
import { ChangeRoleModal } from '../user-management/ChangeRoleModal';
import { useState } from 'react';
import { updateRole } from '../../services/user-management';
import { buttonBase, buttonColor } from '@components';

export interface UserManagementProps {
  employees: EmployeeRO[];
  loading: boolean;
  updateUser: (id: string, role: ValidRoles) => void;
  onSortChange: (field: string) => void;
}

export const UserManagementTable = (props: UserManagementProps) => {
  const { employees, loading, onSortChange, updateUser } = props;

  const [selectedUser, setSelectedUser] = useState<EmployeeRO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (user: EmployeeRO) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const changeRole = async (role: ValidRoles) => {
    if (selectedUser) {
      const res = await updateRole(selectedUser.id, role);
      if (res) {
        updateUser(selectedUser.id, role);
        setModalOpen(false);
      }
    }
  };

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='px-6 py-4'>
              <SortButton label='Name' sortKey='name' onChange={onSortChange} />
            </th>
            <th className='px-6'>Email Address</th>
            <th className='px-6'>
              <SortButton label='Created On' sortKey='createdDate' onChange={onSortChange} />
            </th>
            <th className='px-6'>
              <SortButton label='Role' sortKey='role' onChange={onSortChange} />
            </th>
            <th className=''></th>
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
            employees.map((employee: EmployeeRO) => (
              <tr
                key={employee.id}
                className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm '
              >
                <td className='pl-6 py-5'>{employee.name}</td>
                <td className='px-6'>{employee.email}</td>
                <td className='px-6'>{employee.createdDate && formatDate(employee.createdDate)}</td>
                <td className='px-6'>{employee.role.toUpperCase()}</td>

                <td className='px-6 text-right'>
                  {employee.role === ValidRoles.ROLEADMIN ? (
                    ''
                  ) : (
                    <button
                      className={`px-4 ${buttonColor.outline} ${buttonBase} border-bcGray text-bcGray`}
                      onClick={() => openModal(employee)}
                    >
                      Change Role
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ChangeRoleModal
        open={modalOpen}
        user={selectedUser}
        submit={changeRole}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};
