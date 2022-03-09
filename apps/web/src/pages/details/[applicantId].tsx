import { faClock, faListAlt, faPencilAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { DetailsItem } from 'src/components/DetailsItem';
import { buttonColor, buttonBase, Label } from '@components';
import { getApplicant } from '@services';

const Details = () => {
  const [applicant, setApplicant] = useState<any>({});

  const router = useRouter();
  let applicantId = router.query.applicantId;

  useEffect(() => {
    if (router.isReady) {
      if (applicantId !== undefined) {
        const getApplicantData = async (id: any) => {
          const {
            data: { data },
          } = await getApplicant(id);
          setApplicant(data);
        };

        getApplicantData(applicantId);
      }
    }
  }, [router, applicantId]);

  // @todo move to helper file once decorator errors are fixed ??
  const formatDate = (value: string) => {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    return month + ' ' + day + ', ' + year;
  };

  if (!applicant || !applicant.assigned_to || !applicant.ha_pcn) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className='container'>
        <p className='text-xs text-gray-400 mt-3 mb-5'>
          Manage Applicants / <span className='text-blue-800 font-bold'>Applicant Details</span>
        </p>
        <h1 className='font-bold text-3xl'>{applicant.name} #ID4321</h1>
        <p className='text-gray-400 text-sm pt-1 pb-4'>Last Updated: January 5, 2022</p>
        <div className='grid grid-cols-12 border-2 rounded px-5 pb-3'>
          <div className='col-span-12 border-b mb-3'>
            <h1 className='text-xl text-blue-900 py-3 font-bold'>
              <FontAwesomeIcon
                className='h-5 mr-2 inline-block items-center'
                icon={faListAlt}
              ></FontAwesomeIcon>
              Details
            </h1>
          </div>
          <div className='col-span-4'>
            <DetailsItem title='Email address' text={applicant.email} />
          </div>
          <div className='col-span-4'>
            <DetailsItem title='Assigned to' text={applicant.assigned_to[0].name} />
          </div>
          <div className='col-span-4'>
            <DetailsItem title='Country of Citizenship' text={applicant.citizenship} />
          </div>
          <div className='col-span-4'>
            <DetailsItem
              title='Permanent Resident of Canada'
              text={applicant.pr_of_canada ? 'Yes' : 'No'}
            />
          </div>
          <div className='col-span-4'>
            <DetailsItem title='Country of Training' text={applicant.country_of_training} />
          </div>
          <div className='col-span-4'>
            <DetailsItem title='Registration date' text={formatDate(applicant.registration_date)} />
          </div>
        </div>

        <div className='border-2 rounded px-5 my-5'>
          <div className='flex items-center border-b'>
            <FontAwesomeIcon className='h-5 mr-2 text-blue-900 ' icon={faClock}></FontAwesomeIcon>
            <h1 className='text-xl text-blue-900 py-4 font-bold'>Milestones Logs</h1>
            <Link
              as={`/details/${applicant.id}?milestone=add`}
              href={{
                pathname: `/details/${applicant.id}`,
                query: { ...router.query, milestone: 'add' },
              }}
              shallow={true}
            >
              <a className={`ml-auto pointer-events-none ${buttonColor.secondary} ${buttonBase}`}>
                <FontAwesomeIcon className='h-4 mr-2' icon={faPlusCircle}></FontAwesomeIcon>
                Add Milestones
              </a>
            </Link>
          </div>
          <p className='text-gray-400 pt-4 pb-2'>Showing 23 logs</p>
          <div className='flex justify-content-center flex-col overflow-x-auto'>
            <table className='text-left text-sm'>
              <thead className='whitespace-nowrap bg-gray-100'>
                <tr className='border-b-2 border-yellow-300'>
                  <th className='px-6 py-3'>User</th>
                  <th className='px-6 py-3'>Milestones</th>
                  <th className='px-6 py-3'>Note</th>
                  <th className='px-6 py-3'>Timestamp</th>
                  <th className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody>
                <tr className='text-left whitespace-nowrap even:bg-gray-100 text-sm '>
                  <th className=' font-normal px-6 py-4'>
                    Auston Matthews<span className='block text-gray-400'>HLTH.FraserHealth</span>
                  </th>
                  <th className='font-normal px-6 py-4'>HMBC - Profile Complete</th>
                  <th className='font-normal px-6 py-4'>Followed up</th>
                  <th className='font-normal px-6 py-2'>January 5, 2022</th>
                  <th className='w-full text-right font-normal px-6 py-2'>
                    <Link
                      as={`/details/${applicant.id}?milestone=edit`}
                      href={{
                        pathname: `/details/${applicant.id}`,
                        query: { ...router.query, milestone: 'edit' },
                      }}
                      shallow={true}
                    >
                      <a className={`pointer-events-none ${buttonColor.outline} ${buttonBase}`}>
                        <FontAwesomeIcon className='h-4' icon={faPencilAlt}></FontAwesomeIcon>
                      </a>
                    </Link>
                  </th>
                </tr>
                <tr className='text-left whitespace-nowrap even:bg-gray-100 text-sm '>
                  <th className=' font-normal px-6 py-4'>
                    Purple Pickle<span className='block text-gray-400'>HLTH.FraserHealth</span>
                  </th>
                  <th className='font-normal px-6 py-4'>HMBC - Profile Complete</th>
                  <th className='font-normal px-6 py-4'>Followed up</th>
                  <th className='font-normal px-6 py-2'>June 5, 2021</th>
                  <th className='w-full text-right font-normal px-6 py-2'>
                    <Link
                      as={`/details/${applicant.id}?milestone=edit`}
                      href={{
                        pathname: `/details/${applicant.id}`,
                        query: { ...router.query, milestone: 'edit' },
                      }}
                      shallow={true}
                    >
                      <a
                        className={`ml-0 pointer-events-none ${buttonColor.outline} ${buttonBase}`}
                      >
                        <FontAwesomeIcon className='h-4' icon={faPencilAlt}></FontAwesomeIcon>
                      </a>
                    </Link>
                  </th>
                </tr>
                <tr className='text-left whitespace-nowrap even:bg-gray-100 text-sm '>
                  <th className=' font-normal px-6 py-4'>
                    Red Tuna<span className='block text-gray-400'>HLTH.FraserHealth</span>
                  </th>
                  <th className='font-normal px-6 py-4'>HMBC - Registered for HMBC services</th>
                  <th className='font-normal px-6 py-4'>Followed up</th>
                  <th className='font-normal px-6 py-2'>August 5, 2020</th>
                  <th className='w-full text-right font-normal px-6 py-2'>
                    <Link
                      as={`/details/${applicant.id}?milestone=edit`}
                      href={{
                        pathname: `/details/${applicant.id}`,
                        query: { ...router.query, milestone: 'edit' },
                      }}
                      shallow={true}
                    >
                      <a className={`pointer-events-none ${buttonColor.outline} ${buttonBase}`}>
                        <FontAwesomeIcon className='h-4' icon={faPencilAlt}></FontAwesomeIcon>
                      </a>
                    </Link>
                  </th>
                </tr>
                <tr className='text-left whitespace-nowrap even:bg-gray-100 text-sm '>
                  <th className=' font-normal px-6 py-4'>
                    Mustard Ketchup<span className='block text-gray-400'>HLTH.FraserHealth</span>
                  </th>
                  <th className='font-normal px-6 py-4'>HMBC - Registered for HMBC services</th>
                  <th className='font-normal px-6 py-4'>Followed up</th>
                  <th className='font-normal px-6 py-2'>March 51, 2019</th>
                  <th className='w-full text-right font-normal px-6 py-2'>
                    <Link
                      as={`/details/${applicant.id}?milestone=edit`}
                      href={{
                        pathname: `/details/${applicant.id}`,
                        query: { ...router.query, milestone: 'edit' },
                      }}
                      shallow={true}
                    >
                      <a className={`pointer-events-none ${buttonColor.outline} ${buttonBase}`}>
                        <FontAwesomeIcon className='h-4' icon={faPencilAlt}></FontAwesomeIcon>
                      </a>
                    </Link>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <div>pagination here</div>
        </div>
      </div>
    </>
  );
};

export default Details;
