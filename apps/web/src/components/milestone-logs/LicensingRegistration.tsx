interface LicensingRegistrationProps {
  records: any;
}

// @todo move to helper file once decorator errors are fixed ??
const formatDate = (value: string) => {
  const date = new Date(value);
  const day = date.toLocaleString('default', { day: '2-digit' });
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: 'numeric' });
  return `${month} ${day}, ${year}`;
};

export const LicensingRegistration: React.FC<LicensingRegistrationProps> = ({ records }) => {
  return (
    <>
      <p className='text-gray-400 pt-4 pb-2'>Showing {records.length} logs</p>
      <div className='flex justify-content-center flex-col overflow-x-auto'>
        <table className='text-left text-sm'>
          <thead className='whitespace-nowrap bg-gray-100'>
            <tr className='border-b-2 border-yellow-300'>
              <th className='px-6 py-3'>Milestones</th>
              <th className='px-6 py-3'>Start Date</th>
              <th className='px-6 py-3'>End Date</th>
              <th className='px-6 py-3'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {/* fix any type */}
            {records.map((mil: any, index: number) => (
              <tr key={index} className='text-left whitespace-nowrap even:bg-gray-100 text-sm '>
                <th className=' font-normal pl-6 w-2/5 py-4'>
                  <span className='rounded bg-gray-600 text-xs text-white font-medium px-2'>
                    Candidate
                  </span>
                  <span className='pl-2'>{mil.status.status}</span>
                </th>
                <th className='font-normal px-6 py-4 w-1/5'>{formatDate(mil.start_date)}</th>
                <th className='font-normal px-6 py-4 w-1/5'>
                  {mil.end_date ? formatDate(mil.end_date) : 'N/A'}
                </th>
                <th className='font-normal px-6 py-2 w-1/5'>5 days</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>pagination here</div>
    </>
  );
};
