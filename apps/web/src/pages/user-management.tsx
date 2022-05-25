import { useEffect, useState } from 'react';

import { UserManagementTable } from 'src/components/display/UserManagementTable';
import withAuth from 'src/components/Keycloak';
import { PageOptions, Pagination } from 'src/components/Pagination';
import { getEmployees } from 'src/services/user-management';
import { ValidRoles } from '@services';
import { EmployeeRO } from '@ien/common';
import { Spinner } from 'src/components/Spinner';
import { EmployeeFilters } from 'src/components/user-management/UserFilter';
import { SearchEmployee } from 'src/components/SearchEmployee';

interface SearchOptions {
  name?: string;
  role?: string[];
  sortKey?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}

export interface EmployeeFilterOptions {
  name?: string[];
  roles?: string[];
  skip?: number;
  limit?: number;
}

const DEFAULT_PAGE_SIZE = 10;

const UserManagement = () => {
  const [employees, setEmployees] = useState<EmployeeRO[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState<string>('');
  const [filters, setFilters] = useState<Partial<EmployeeFilterOptions>>({});
  const [roles, setRoles] = useState<string[] | undefined>([]);
  const [sortKey, setSortKey] = useState('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * limit;
    const options: SearchOptions = { name, role: roles, sortKey, order, limit, skip };

    getEmployees(options).then(({ data, count }) => {
      setTotal(count);
      if (count < limit) {
        setPage(1);
      }
      setEmployees(data);
    });

    setLoading(false);
  }, [name, sortKey, order, page, limit, roles]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setOrder(key === 'createdDate' ? 'DESC' : 'ASC');
      setSortKey(key);
    }
  };

  const handlePageOptions = ({ pageIndex, pageSize }: PageOptions) => {
    if (pageSize !== limit) {
      setLimit(pageSize);
      setPage(1);
    } else {
      setPage(pageIndex);
    }
  };

  const handleFilters = (filterBy: EmployeeFilterOptions) => {
    setRoles(filterBy.roles);
    setPage(1);
    setFilters(filterBy);
  };

  if (loading) {
    return <Spinner className='h-10' />;
  }

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-5 pb-1'>User Management</h1>
      <h4 className='pb-5'>Manage user access and user roles</h4>
      <div className='bg-white p-4'>
        <h3 className='font-bold text-lg text-bcBluePrimary'>All Users</h3>
        <div className='py-2'>
          <SearchEmployee keyword={name} onChange={setName} />
        </div>
        <EmployeeFilters options={filters} update={handleFilters} />
        <div className='opacity-50'>{`Showing ${employees && employees.length} users`}</div>
      </div>
      <div className='flex justify-content-center flex-col bg-white px-4 pb-4'>
        <Pagination
          pageOptions={{ pageIndex: page, pageSize: limit, total }}
          onChange={handlePageOptions}
        />

        <UserManagementTable employees={employees} loading={loading} onSortChange={handleSort} />

        <Pagination
          pageOptions={{ pageIndex: page, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
      </div>
    </div>
  );
};

export default withAuth(UserManagement, [ValidRoles.ROLEADMIN]);
