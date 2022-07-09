import { useEffect, useState } from 'react';

import { UserManagementTable } from 'src/components/display/UserManagementTable';
import withAuth from 'src/components/Keycloak';
import { PageOptions, Pagination } from 'src/components/Pagination';
import { getEmployees } from 'src/services/user-management';
import { Access, EmployeeRO } from '@ien/common';
import { UserFilter } from 'src/components/user-management/UserFilter';
import { SearchEmployee } from 'src/components/SearchEmployee';

interface SearchOptions {
  name?: string;
  role?: string[];
  revokedOnly?: boolean;
  sortKey?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}

const DEFAULT_PAGE_SIZE = 10;

const UserManagement = () => {
  const [employees, setEmployees] = useState<EmployeeRO[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState<string>('');
  const [roles, setRoles] = useState<string[]>([]);
  const [revokedOnly, setRevokedOnly] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);

    const skip = (page - 1) * limit;
    const options: SearchOptions = { name, role: roles, sortKey, order, limit, skip, revokedOnly };

    getEmployees(options).then(res => {
      if (res) {
        const [data, count] = res;
        setTotal(count);
        if (count < limit) {
          setPage(1);
        }
        setEmployees(data);
      }
      setLoading(false);
    });
  }, [name, sortKey, order, page, limit, roles, revokedOnly]);

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

  const handleFilters = (role_ids: string[]) => {
    setRoles(role_ids);
    setPage(1);
  };

  const updateUser = (user: EmployeeRO) => {
    const index = employees.findIndex(e => e.id === user.id);
    if (index >= 0) {
      employees.splice(index, 1, user);
      setEmployees([...employees]);
    }
  };

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-6 pb-1'>User Management</h1>
      <div className='pb-5'>Manage user access and user roles</div>
      <div className='bg-white p-4'>
        <h2 className='font-bold text-lg text-bcBluePrimary'>All Users</h2>
        <div className='py-2'>
          <SearchEmployee keyword={name} onChange={setName} />
        </div>
        <UserFilter
          roles={roles}
          updateRoles={handleFilters}
          revokedOnly={revokedOnly}
          setRevokedOnly={setRevokedOnly}
        />
        <div className='text-bcGray'>{`Showing ${employees && employees.length} users`}</div>
      </div>
      <div className='flex justify-content-center flex-col bg-white px-4 pb-4'>
        <Pagination
          pageOptions={{ pageIndex: page, pageSize: limit, total }}
          onChange={handlePageOptions}
        />

        <UserManagementTable
          employees={employees}
          loading={loading}
          onSortChange={handleSort}
          updateUser={updateUser}
        />

        <Pagination
          pageOptions={{ pageIndex: page, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
      </div>
    </div>
  );
};

export default withAuth(UserManagement, [Access.USER_READ, Access.USER_WRITE]);
