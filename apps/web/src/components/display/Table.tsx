import { useRouter } from 'next/router';
import Link from 'next/link';

import { AddSingleModal } from './AddSingleModal';
import { UploadFileModal } from './UploadFileModal';
import { buttonBase, buttonColor, TableCheckbox } from '../';
import { useEffect, useState } from 'react';
import { getApplicants, landingPageTabs } from '@services';
import { SearchBar } from '../SearchBar';
import { Spinner } from '../Spinner';
import { HeaderTab } from './HeaderTab';
import { Pagination } from '../Pagination';

export const Table: React.FC = () => {
  const [applicants, setApplicants] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clamp = (input: number, min: number, max: number): number => {
    return Math.min(Math.max(input, min), max);
  };

  const [totalRecordCount, setTotalRecordCount] = useState(50);
  const numberOfPages = Math.ceil(totalRecordCount / 10);
  const currentPage = clamp(parseInt(router.query?.page as string) || 1, 1, numberOfPages || 1);

  useEffect(() => {
    const getApplicantsData = async () => {
      setLoading(true);

      const {
        data: { data },
      } = await getApplicants();

      setLoading(false);
      setApplicants(data);
    };
    getApplicantsData();
    setTotalRecordCount(applicants.length);
  }, [totalRecordCount]);

  if (loading) {
    return <Spinner className='h-20' />;
  }

  const onTabClick = () => {};

  return (
    <>
      <h1 className='font-bold text-3xl py-5'>Manage Applicants</h1>
      <SearchBar />
      <div className='container mx-auto bg-white w-screen'>
        <HeaderTab tabs={landingPageTabs} onTabClick={onTabClick} />
        <div className='flex items-center my-3 px-4'>
          <p className='text-bcGray'>Showing {applicants.length} results</p>
        </div>

        <div className='flex justify-content-center flex-col px-4 pb-4'>
          <div className='flex justify-content-center flex-col overflow-x-auto'>
            <table className='text-left border border-text-bcGray'>
              <thead className='whitespace-nowrap bg-gray-100'>
                <tr className='border-b-2 border-yellow-300 text-sm'>
                  <th className='pl-6 py-3'>ID</th>
                  <th className='px-6 py-3'>Name</th>
                  <th className='px-6 py-3 w-1/4'>Current Milestones</th>
                  <th className='px-6 py-3'>Last Updated</th>
                  <th className='w-auto'></th>
                </tr>
              </thead>
              <tbody>
                {applicants &&
                  applicants.map((app: any) => (
                    <tr
                      key={app.id}
                      className='text-left whitespace-nowrap even:bg-gray-100 text-sm '
                    >
                      <th className='font-normal px-6 py-4'>AB1234</th>
                      <th className='font-normal px-6 py-4'>{app.name}</th>

                      <th className='font-normal px-6 py-2'>{app.status.status}</th>
                      <th className='font-normal px-6 py-4'>January 5, 2022</th>
                      <td className='font-normal px-6 py-4 text-right'>
                        <Link
                          href={{
                            pathname: `details/${app.id}`,
                            query: {
                              applicantId: app.id,
                            },
                          }}
                          as={`details/${app.id}`}
                        >
                          <a className={`px-5 ${buttonColor.outline} ${buttonBase}`}>Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Pagination page={currentPage} totalItems={totalRecordCount} urlRoot='/form' />
        </div>
      </div>
      <AddSingleModal />
      <UploadFileModal />
    </>
  );
};
