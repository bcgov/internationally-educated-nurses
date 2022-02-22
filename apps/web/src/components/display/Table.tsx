import { useRouter } from 'next/router';
import Link from 'next/link';

import { AddSingleModal } from './AddSingleModal';
import { UploadFileModal } from './UploadFileModal';
import { buttonBase, buttonColor } from '../';

export const Table: React.FC = () => {
  const router = useRouter();

  const sampleData = [
    {
      id: '1',
      name: 'Floyd Miles',
      profession: 'Nurse practitioner',
      specialty: 'Arms/Legs/Torso',
      community: 'HA',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
    {
      id: '2',
      name: 'Auston Matthews',
      profession: 'Nurse practitioner',
      specialty: 'Arms',
      community: 'FHA',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
    {
      id: '3',
      name: 'John Doe',
      profession: 'Nurse practitioner',
      specialty: 'Legs',
      community: 'PCN',
      assigned: 'Dianne Russell',
      status: 'Not initial',
    },
    {
      id: '4',
      name: 'Floyd Miles',
      profession: 'Nurse practitioner',
      specialty: 'Lungs',
      community: 'HA',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
    {
      id: '5',
      name: 'Floyd Miles',
      profession: 'Nurse practitioner',
      specialty: 'Chronic Disease/Diabetes',
      community: 'PCN',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
    {
      id: '6',
      name: 'Floyd Miles',
      profession: 'Nurse practitioner',
      specialty: 'Chronic Disease/Diabetes',
      community: 'PCN',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
    {
      id: '7',
      name: 'Floyd Miles',
      profession: 'Nurse practitioner',
      specialty: 'Chronic Disease/Diabetes',
      community: 'PCN',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
    {
      id: '8',
      name: 'Floyd Miles',
      profession: 'Nurse practitioner',
      specialty: 'Chronic Disease/Diabetes',
      community: 'PCN',
      assigned: 'Dianne Russell',
      status: 'Initial',
    },
  ];

  const uploadOptionsArray = [
    { value: 'add-row', label: 'Add Row' },
    { value: 'bulk-upload', label: 'Bulk Upload' },
  ];

  return (
    <>
      <div className='container'>
        <h1 className='font-bold text-3xl py-5'>Manage Applications</h1>
        <div className='flex justify-end items-end'>
          <Link
            href={{
              pathname: '/login',
              query: { ...router.query, add_row: 'test_single_row' },
            }}
            shallow={true}
          >
            <a className={`m-2 ${buttonColor.primary} ${buttonBase}`}>Add Row</a>
          </Link>{' '}
          <Link
            href={{
              pathname: '/login',
              query: { ...router.query, bulk_upload: 'test_bulk_upload' },
            }}
            shallow={true}
          >
            <a className={`m-2 ${buttonColor.primary} ${buttonBase}`}>Bulk Upload</a>
          </Link>
        </div>

        <div className='flex-grow flex-col overflow-x-auto'>
          <table className='text-left'>
            <thead className='whitespace-nowrap'>
              <tr className='border-b-2 border-yellow-300'>
                <th className='px-6 py-3'>Name</th>
                <th className='px-6 py-3'>Profession</th>
                <th className='px-6 py-3'>Specialty</th>
                <th className='px-6 py-3'>HA or PCN Community</th>
                <th className='px-6 py-3'>Assigned</th>
                <th className='px-6 py-3'>Recruitment Status</th>
                <th className='px-6 py-3'></th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map(nurse => (
                <tr
                  key={nurse.id}
                  className='text-left whitespace-nowrap even:bg-gray-100 text-sm '
                >
                  <th className='font-normal px-6 py-4'>{nurse.name}</th>
                  <th className='font-normal px-6 py-2'>{nurse.profession}</th>
                  <th className='font-normal px-6 py-2'>{nurse.specialty}</th>
                  <th className='font-normal px-6 py-2'>{nurse.community}</th>
                  <th className='font-normal px-6 py-2'>{nurse.assigned}</th>
                  <th className='font-normal px-6 py-2'>{nurse.status}</th>
                  <td className='font-normal px-6 py-4'>
                    <a href='#' className='text-blue-500 px-1 py-1'>
                      Details
                    </a>
                    |
                    <a href='#' className='text-red-500 px-1 py-1'>
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>pagination here</div>
      </div>
      <AddSingleModal />
      <UploadFileModal />
    </>
  );
};
