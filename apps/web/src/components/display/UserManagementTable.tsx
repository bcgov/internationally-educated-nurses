import Link from 'next/link';
import { useRouter } from 'next/router';
import { EmployeeRO, formatDate } from '@ien/common';
import { buttonBase, buttonColor } from '@components';
import { Spinner } from '../Spinner';
import { SortButton } from '../SortButton';

export interface UserManagementProps {
  employees: EmployeeRO[];
  loading: boolean;
  updateUser: (user: EmployeeRO) => void;
  onSortChange: (field: string) => void;
}

export const UserManagementTable = (props: UserManagementProps) => {
  const { employees, loading, onSortChange } = props;

  const router = useRouter();

  const getStatus = (user: EmployeeRO) => {
    if (user.revoked_access_date) return 'Revoked';
    if (!user.roles?.length) return 'Pending';
    return 'Active';
  };

  const getStatusClass = (user: EmployeeRO): string => {
    if (user.revoked_access_date) return 'text-bcDarkRed';
    if (!user.roles?.length) return '';
    return 'text-bcGreenSuccess';
  };

  const getButton = (employee: EmployeeRO, index: number) => {
    return (
      <Link
        href={{
          pathname: `/user`,
          query: { ...router?.query, id: employee.id },
        }}
      >
        <a
          className={`px-4 ${buttonColor.outline} ${buttonBase} text-bcGray`}
          id={`details-${index}`}
        >
          Details
        </a>
      </Link>
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
              <SortButton label='Created On' sortKey='created_date' onChange={onSortChange} />
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
                <Spinner size='1x' relative />
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
                <td className='px-6'>
                  {employee.created_date && formatDate(employee.created_date)}
                </td>
                <td className='px-6 max-w-xs truncate'>
                  {employee.roles?.map(({ name }) => name).join(',')}
                </td>
                <td className={`px-6 text-center ${getStatusClass(employee)}`}>
                  {getStatus(employee)}
                </td>
                <td className='px-6 text-right'>{getButton(employee, index)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
