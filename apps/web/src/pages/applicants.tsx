import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { Access, ApplicantRO, HealthAuthorities, StatusCategory } from '@ien/common';
import { getApplicants, milestoneTabs } from '@services';
import { Search } from '../components/Search';
import { StatusCategoryTab } from '../components/display/StatusCategoryTab';
import withAuth from '../components/Keycloak';
import {
  AddApplicantModal,
  ApplicantTable,
  Button,
  PageOptions,
  Pagination,
  AclMask,
} from '@components';
import { useAuthContext } from '../components/AuthContexts';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { useSessionStorage } from '@/components/admin/hooks/useSessionStorage';

interface SearchOptions {
  name?: string;
  status?: string;
  showHiddenApplicants?: boolean;
  sortKey?: string;
  recruiter?: string;
  order?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}

const HA_CAN_ADD_APPLICANT = false;

const DEFAULT_PAGE_SIZE = 10;
const QUERY_DELAY = 300;

const Applicants = () => {
  const { authUser } = useAuthContext();
  const [applicants, setApplicants] = useState<ApplicantRO[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHiddenApplicants, setShowHiddenApplicants] = useSessionStorage<boolean | undefined>(
    'showHiddenApplicants',
    undefined,
  );
  const [myApplicantsOnly, setMyApplicantsOnly] = useState(false);
  const router = useRouter();

  // search options
  const name = router.query.name as string;
  const status = router.query.status as string;

  const [sortKey, setSortKey] = useState('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useSessionStorage<number>('applicantPageIndex', 1);
  const [total, setTotal] = useState(0);

  const [addIenModalVisible, setAddIenModalVisible] = useState(false);

  const timer = useRef<number>();

  const searchApplicants = async (
    options: SearchOptions,
  ): Promise<{ data: ApplicantRO[]; count: number }> => {
    if (myApplicantsOnly) {
      options.recruiter = authUser?.id;
    }
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
    const options: SearchOptions = { name: searchName, limit: searchLimit };
    return searchApplicants(options).then(({ data }) => data);
  };

  useEffect(() => {
    const skip = (pageIndex - 1) * limit;
    const options: SearchOptions = {
      name,
      sortKey,
      order,
      limit,
      skip,
      showHiddenApplicants,
    };
    if (status && status !== 'ALL') options.status = `${status}`;
    setLoading(true);
    searchApplicants(options).then(({ data, count }) => {
      setTotal(count);
      if (count < limit) {
        setPageIndex(1);
      }
      setApplicants(data);
      setLoading(false);
    });
  }, [name, status, sortKey, order, pageIndex, limit, showHiddenApplicants, myApplicantsOnly]);

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

  const changeRoute = (keyword: string, tabStatus: string) => {
    const urlParams = new URLSearchParams();

    keyword && urlParams.append('name', keyword);
    urlParams.append('status', tabStatus);

    router.push(`?${urlParams.toString()}`, undefined, { shallow: true });
  };

  const handleKeywordChange = (keyword: string) => {
    setPageIndex(1);
    changeRoute(keyword, StatusCategory.ALL);
  };

  const handleTabChange = (index: string) => {
    setPageIndex(1);
    changeRoute(name, index ?? StatusCategory.ALL);
  };

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <div className='flex items-center justify-between'>
        <h1 className='font-bold text-4xl py-6'>Manage Applicants</h1>
      </div>
      <Search
        onChange={handleKeywordChange}
        keyword={name}
        onSelect={viewDetail}
        search={searchByName}
      />

      <div className='bg-white'>
        {authUser?.ha_pcn_id ? (
          <div className='font-bold px-4 pt-3 pb-2 text-3xl'>IENs ready for recruitment</div>
        ) : (
          <StatusCategoryTab
            tabs={[{ title: 'All', value: StatusCategory.ALL }, ...milestoneTabs]}
            categoryIndex={status ?? StatusCategory.ALL}
            onTabClick={value => handleTabChange(value)}
          />
        )}
        <div className='flex flex-row justify-between'>
          <div className='text-bcGray px-4 mb-4'>{`Showing ${applicants.length} results`}</div>
          <AclMask authorities={HealthAuthorities}>
            <div className='flex flex-row'>
              <div className='flex content-center' data-cy='my-applicants-only'>
                <span className='mr-2 text-bcGray'>Only show my applicants</span>
                <ToggleSwitch
                  checked={myApplicantsOnly}
                  screenReaderText='Only show my applicants'
                  onChange={setMyApplicantsOnly}
                />
              </div>
              <div className='flex content-center px-4' data-cy='hide-inactive-applicants'>
                <span className='mr-2 text-bcGray'>Show hidden applicants</span>
                <ToggleSwitch
                  checked={showHiddenApplicants || false}
                  screenReaderText='Only show my applicants'
                  onChange={setShowHiddenApplicants}
                />
              </div>
            </div>
          </AclMask>
        </div>
        <div className='flex justify-between items-center'>
          {HA_CAN_ADD_APPLICANT && (
            <AclMask acl={[Access.APPLICANT_WRITE]}>
              <Button
                className='mr-4 mb-3'
                variant='secondary'
                type='button'
                onClick={() => setAddIenModalVisible(true)}
              >
                Add Applicant
              </Button>
              <AddApplicantModal
                onClose={() => setAddIenModalVisible(false)}
                visible={addIenModalVisible}
                applicants={applicants}
                setApplicant={setApplicants}
              />
            </AclMask>
          )}
        </div>
      </div>
      <div className='flex justify-content-center flex-col bg-white px-4 pb-4'>
        <Pagination
          id='applicant-page-top'
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
        <ApplicantTable
          applicants={applicants}
          onSortChange={handleSort}
          loading={loading}
          showHiddenApplicants={showHiddenApplicants}
        />
        <Pagination
          id='applicant-page-bottom'
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
      </div>
    </div>
  );
};

// withAuth ensures only authenticated users with a given role are permitted to use a route
// I have included the pending role here not to lock out any user, but in future most routes should be restricted
export default withAuth(Applicants, [Access.APPLICANT_READ, Access.APPLICANT_WRITE], false);
