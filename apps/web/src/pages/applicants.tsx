import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { getApplicants, milestoneTabs } from '@services';
import { Search } from '../components/Search';
import { HeaderTab } from '../components/display/HeaderTab';
import { PageOptions, Pagination } from '../components/Pagination';
import withAuth from '../components/Keycloak';
import { Access, ApplicantRO } from '@ien/common';
import { AddApplicantModal, Button, ApplicantTable } from '@components';

interface SearchOptions {
  name?: string;
  status?: string;
  sortKey?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}

const DEFAULT_PAGE_SIZE = 10;
const QUERY_DELAY = 300;

const Applicants = () => {
  const [applicants, setApplicants] = useState<ApplicantRO[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // search options
  const name = router.query.name as string;
  const status = +(router.query.status as string);

  const [sortKey, setSortKey] = useState('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);

  const [addIenModalVisible, setAddIenModalVisible] = useState(false);

  const timer = useRef<number>();

  const searchApplicants = async (
    options: SearchOptions,
  ): Promise<{ data: ApplicantRO[]; count: number }> => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    return new Promise((resolve, reject) => {
      timer.current = window.setTimeout(async () => {
        try {
          const data = await getApplicants(options);
          resolve(data);
        } catch (e) {
          reject(e);
        } finally {
          timer.current = 0;
        }
      }, QUERY_DELAY);
    });
  };

  const searchByName = async (searchName: string, searchLimit: number) => {
    return searchApplicants({ name: searchName, limit: searchLimit }).then(({ data }) => data);
  };

  useEffect(() => {
    const skip = (pageIndex - 1) * limit;
    const options: SearchOptions = { name, sortKey, order, limit, skip };
    if (status) options.status = `${status}`;
    setLoading(true);
    searchApplicants(options).then(({ data, count }) => {
      setTotal(count);
      if (count < limit) {
        setPageIndex(1);
      }
      setApplicants(data);
      setLoading(false);
    });
  }, [name, status, sortKey, order, pageIndex, limit]);

  const viewDetail = (id: string) => router.push(`/details?id=${id}`);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setOrder(key === 'updated_date' ? 'DESC' : 'ASC');
      setSortKey(key);
    }
  };

  const handlePageOptions = ({ pageIndex: pgIndex, pageSize: pgSize }: PageOptions) => {
    if (pgSize !== limit) {
      setLimit(pgSize);
      setPageIndex(1);
    } else {
      setPageIndex(pgIndex);
    }
  };

  const changeRoute = (keyword: string, tabIndex: number) => {
    const urlParams = new URLSearchParams();

    keyword && urlParams.append('name', keyword);
    urlParams.append('status', tabIndex.toString());

    router.push(`?${urlParams.toString()}`, undefined, { shallow: true });
  };

  const handleKeywordChange = (keyword: string) => {
    setPageIndex(1);
    changeRoute(keyword, 0);
  };

  const handleTabChange = (index: number) => {
    setPageIndex(1);
    changeRoute(name, index ? index + 10000 : 0);
  };

  const handleAddApplicant = () => {
    setAddIenModalVisible(false);
  };

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl py-6'>Manage Applicants</h1>
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
          onTabClick={handleTabChange}
        />
        <div className='flex justify-between items-center'>
          <div className='text-bcGray px-4'>{`Showing ${applicants.length} results`}</div>
          <Button
            className='mr-4 mb-3'
            variant='secondary'
            type='button'
            onClick={() => setAddIenModalVisible(true)}
          >
            Add Applicant
          </Button>
        </div>
      </div>
      <div className='flex justify-content-center flex-col bg-white px-4 pb-4'>
        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
        <ApplicantTable applicants={applicants} onSortChange={handleSort} loading={loading} />
        <AddApplicantModal
          onClose={handleAddApplicant}
          visible={addIenModalVisible}
          applicants={applicants}
          setApplicant={setApplicants}
        />
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
export default withAuth(Applicants, [Access.APPLICANT_READ]);
