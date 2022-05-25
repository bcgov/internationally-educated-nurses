import Link from 'next/link';
import { useRouter } from 'next/router';

import { buttonBase, buttonColor } from '@components';
import { EmployeeRO, formatDate } from '@ien/common';
import { Spinner } from '../Spinner';
import { SortButton } from '../SortButton';

export interface UserManagementProps {
  employees: EmployeeRO[];
  loading: boolean;
  onSortChange: (field: string) => void;
}

export const UserManagementTable = (props: UserManagementProps) => {
  const { employees, loading, onSortChange } = props;
  const router = useRouter();

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
          {employees.length === 0 ? (
            <tr className='text-center shadow-xs text-base font-bold'>
              <td colSpan={4} className='py-4'>
                No Results
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
                  <Link
                    href={{
                      pathname: `/`,
                      query: { ...router?.query, id: employee.id },
                    }}
                  >
                    <a
                      className={` pointer-events-none px-4 ${buttonColor.outline} ${buttonBase} border-bcGray text-bcGray`}
                    >
                      Change Role
                    </a>
                  </Link>
                </td>
              </tr>
            ))
          )}
          {loading && (
            <tr className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm'>
              <td colSpan={5} className='h-64'>
                <Spinner className='h-10' />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
