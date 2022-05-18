import Link from 'next/link';
import { useRouter } from 'next/router';

import sortIcon from '@assets/img/sort.svg';
import { buttonBase, buttonColor } from '@components';
import { EmployeeRO, formatDate } from '@ien/common';

export interface UserManagementProps {
  employees: EmployeeRO[];
  onSortChange: (field: string) => void;
}

export const UserManagementTable = (props: UserManagementProps) => {
  const { employees, onSortChange } = props;
  const router = useRouter();
  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='px-6 py-4'>
              <div className='flex align-middle justify-between'>
                <span>Name</span>
                <button id='sort-by-name' onClick={() => onSortChange('name')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className='px-6'>Email Address</th>
            <th className='px-6'>
              <div className='flex align-middle justify-between'>
                <span>Created On</span>
                <button id='sort-by-name' onClick={() => onSortChange('name')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className='px-6'>
              <div className='flex align-middle justify-between'>
                <span>Role</span>
                <button id='sort-by-name' onClick={() => onSortChange('role')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className=''></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {employees &&
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
                  {employee.role.toLowerCase() !== 'pending' ? (
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
                  ) : null}
                </td>
              </tr>
            ))}
          {/* {loading && (
            <tr className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm'>
              <td colSpan={5} className='h-64'>
                <Spinner className='h-10' />
              </td>
            </tr>
          )} */}
        </tbody>
      </table>
    </div>
  );
};
