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
            <th className='px-3 overflow-hidden' scope='col'>
              ROS Contract Signed
            </th>
            <th className='px-3 overflow-hidden' scope='col'>
              Applied to BCCNM
            </th>
            <th className='px-3 overflow-hidden' scope='col'>
              NCAS Assessment
            </th>
            <th className='px-3 overflow-hidden' scope='col'>
              Country of Education
            </th>
            <th className='px-3 text-center' scope='col'>
              Message
            </th>
            <th className='px-3 text-center' scope='col'>
              Application complete
            </th>
            <th className='px-3 text-center' scope='col'>
              Decision Date
            </th>
            <th className='px-3 text-center' scope='col'>
              Registration Date
            </th>
          </tr>
        </thead>
        <tbody className='text-bcBlack text-sm'>
          {data.map((update, idx) => (
            <tr key={`${update.id}-${idx}`} className='h-12 even:bg-bcLightGray'>
              <td className='px-3'>{update.id}</td>
              <td className='px-3'>{_.startCase(update.name)}</td>
              <td className='px-3'>{update.dateOfRosContract}</td>
              <td className='px-3'>{update.appliedToBccnm}</td>
              <td className='px-3'>{update.ncasCompleteDate}</td>
              <td className='px-3'>{update.countryOfEducation}</td>
              <td className={`px-3 ${!update.valid && 'text-bcRedError'}`}>{update.message}</td>
              <td className='px-3'>{update.bccnmApplicationCompleteDate}</td>
              <td className='px-3'>{update.bccnmDecisionDate}</td>
              <td className='px-3'>{update.bccnmRegistrationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
