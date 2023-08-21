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
          {data.map(({ id, name, dateOfRosContract, message, valid }) => (
            <tr key={id} className='h-12 even:bg-bcLightGray'>
              <td className='px-3'>{id}</td>
              <td className='px-3'>{_.startCase(name)}</td>
              <td className='px-3'>{dateOfRosContract}</td>
              <td className={`px-3 ${!valid && 'text-bcRedError'}`}>{message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
