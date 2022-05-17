import { useEffect, useState } from 'react';

import { UserManagementTable } from 'src/components/display/UserManagementTable';
import withAuth from 'src/components/Keycloak';
import { PageOptions, Pagination } from 'src/components/Pagination';
import { UserFilters } from 'src/components/user-management/UserFilter';
import { getEmployees } from 'src/services/user-management';
import { ValidRoles } from '@services';

const DEFAULT_PAGE_SIZE = 10;

const UserManagement = () => {
  // const [sortKey, setSortKey] = useState('');
  // const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees().then(res => {
      setEmployees(res?.data);
    });
    setTotal(employees.length);
  }, []);

  const handleSort = (key: string) => {
    return key;
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
        <div className='opacity-50'>{`Showing ${employees.length} users`}</div>
      </div>
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
    </div>
  );
};

export default withAuth(UserManagement, [ValidRoles.ROLEADMIN]);
