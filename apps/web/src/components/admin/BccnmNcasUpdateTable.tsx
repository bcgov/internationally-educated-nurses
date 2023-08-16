import _ from 'lodash';
import { BccnmNcasValidation } from '@ien/common';

interface BccnmNcasUpdateTableProps {
  data: BccnmNcasValidation[];
}

export const BccnmNcasUpdateTable = ({ data }: BccnmNcasUpdateTableProps) => {
  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full table-fixed'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='h-12 border-b-2 border-yellow-300 text-sm'>
            <th className='px-3' scope='col'>
              ID
            </th>
            <th className='px-3' scope='col'>
              Name
            </th>
            <th className='px-3' scope='col'>
              ROS Contract Signed
            </th>
            <th className='px-3' scope='col'>
              Message
            </th>
          </tr>
        </thead>
        <tbody className='text-bcBlack text-sm'>
          {data.map(row => (
            <tr key={row['HMBC Unique ID']} className='h-12 even:bg-bcLightGray'>
              <td className='px-3'>{row['HMBC Unique ID'].substring(0, 8).toUpperCase()}</td>
              <td className='px-3'>
                {_.capitalize(row['First Name'])} {_.capitalize(row['Last Name'])}
              </td>
              <td className='px-3'>{row['Date ROS Contract Signed']}</td>
              <td className={`px-3 ${!row.valid && 'text-bcRedError'}`}>{row.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
