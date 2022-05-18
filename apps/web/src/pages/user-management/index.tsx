import { useEffect, useState } from 'react';

import { UserManagementTable } from 'src/components/display/UserManagementTable';
import withAuth from 'src/components/Keycloak';
import { PageOptions, Pagination } from 'src/components/Pagination';
import { UserFilters } from 'src/components/user-management/UserFilter';
import { getEmployees } from 'src/services/user-management';
import { ValidRoles } from '@services';
import { EmployeeRO } from '@ien/common';

interface SearchOptions {
  name?: string;
  status?: string;
  sortKey?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}

const DEFAULT_PAGE_SIZE = 10;

const UserManagement = () => {
  const [employees, setEmployees] = useState<EmployeeRO[]>([]);

  const name = '';

  const [sortKey, setSortKey] = useState('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);

  const searchEmployees = async (options: SearchOptions) => {
    return getEmployees(options);
  };

  // const searchByName = async (searchName: string, searchLimit: number) => {
  //   return searchEmployees({ name: searchName, limit: searchLimit }).then(({ data }) => data);
  // };

  useEffect(() => {
    const skip = (pageIndex - 1) * limit;
    const options: SearchOptions = { name, sortKey, order, limit, skip };

    searchEmployees(options).then(({ data, count }) => {
      setTotal(count);
      if (count < limit) {
        setPageIndex(1);
      }
      setEmployees(data);
    });
  }, [name, sortKey, order, pageIndex, limit]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortKey(key);
    }
  };

  const handlePageOptions = ({ pageIndex, pageSize }: PageOptions) => {
    if (pageSize !== limit) {
      setLimit(pageSize);
      setPageIndex(1);
    } else {
      setPageIndex(pageIndex);
    }
  };

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-5 pb-1'>User Management</h1>
      <h4 className='pb-5'>Manage user access and user roles</h4>
      <div className='bg-white p-4'>
        <h3 className='font-bold text-lg text-bcBluePrimary'>All Users</h3>
        <UserFilters />
        <div className='opacity-50'>{`Showing ${employees && employees.length} users`}</div>
      </div>
      {employees && employees.length > 0 && (
        <div className='flex justify-content-center flex-col bg-white px-4 pb-4'>
          <Pagination
            pageOptions={{ pageIndex, pageSize: limit, total }}
            onChange={handlePageOptions}
          />

          <UserManagementTable employees={employees} onSortChange={handleSort} />

          <Pagination
            pageOptions={{ pageIndex, pageSize: limit, total }}
            onChange={handlePageOptions}
          />
        </div>
      )}
    </div>
  );
};

export default withAuth(UserManagement, [ValidRoles.ROLEADMIN]);
