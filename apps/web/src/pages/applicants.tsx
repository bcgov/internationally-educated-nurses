import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getApplicants, milestoneTabs, ValidRoles } from '@services';
import { Search } from '../components/Search';
import { HeaderTab } from '../components/display/HeaderTab';
import { PageOptions, Pagination } from '../components/Pagination';
import { ApplicantTable } from '../components/display/ApplicantTable';
import withAuth from '../components/Keycloak';
import { ApplicantRO } from '@ien/common';

interface SearchOptions {
  name?: string;
  status?: string;
  sortKey?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}

const DEFAULT_PAGE_SIZE = 10;

const Applicants = () => {
  const [applicants, setApplicants] = useState<ApplicantRO[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // search options
  const [name, setName] = useState('');
  const [status, setStatus] = useState<number>(0);
  const [sortKey, setSortKey] = useState('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);

  const searchApplicants = async (options: SearchOptions) => {
    return getApplicants(options);
  };

  const searchByName = async (name: string, limit: number) => {
    return searchApplicants({ name, limit }).then(({ data }) => data);
  };

  const handleKeywordChange = (name: string) => {
    setStatus(0);
    setName(name);
  };

  useEffect(() => {
    setLoading(true);
    const skip = (pageIndex - 1) * limit;
    const options: SearchOptions = { name, sortKey, order, limit, skip };
    if (status) options.status = `${status}`;
    searchApplicants(options).then(({ data, count }) => {
      setTotal(count);
      if (count < limit) {
        setPageIndex(1);
      }
      setApplicants(data);
    });
    setLoading(false);
  }, [name, status, sortKey, order, pageIndex, limit]);

  const viewDetail = (id: string) => router.push(`/details/${id}`);

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

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl py-5'>Manage Applicants</h1>
      <Search
        onChange={handleKeywordChange}
        keyword={name}
        onSelect={viewDetail}
        search={searchByName}
      />

      <div className='bg-white'>
        <HeaderTab
          tabs={[{ title: 'All', value: 0 }, ...milestoneTabs]}
          tabIndex={status ? status - 10000 : 0}
          onTabClick={index => setStatus(index ? index + 10000 : 0)}
        />
        <div className='opacity-50 pb-3 px-4'>{`Showing ${applicants.length} results`}</div>
      </div>
      <div className='flex justify-content-center flex-col bg-white px-4 pb-4'>
        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
        <ApplicantTable applicants={applicants} onSortChange={handleSort} />
        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
      </div>
    </div>
  );
};

// withAuth ensures only authenticated users with a given role are permitted to use a route
// I have included the pending role here not to lock out any user, but in future most routes should be restricted
export default withAuth(Applicants, [
  ValidRoles.PENDING,
  ValidRoles.MINISTRY_OF_HEALTH,
  ValidRoles.HEALTH_MATCH,
  ValidRoles.HEALTH_AUTHORITY,
]);
