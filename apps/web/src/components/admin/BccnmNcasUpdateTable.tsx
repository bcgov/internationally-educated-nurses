import _ from 'lodash';
import { BccnmNcasValidation } from '@ien/common';

interface BccnmNcasUpdateTableProps {
  data: BccnmNcasValidation[];
}

export const BccnmNcasUpdateTable = ({ data }: BccnmNcasUpdateTableProps) => {
  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full table-fixed'>
        <thead className='whitespace bg-bcLightGray text-bcDeepBlack'>
          <tr className='h-12 border-b-2 border-yellow-300 text-sm'>
            <th className='px-2' scope='col'>
              ID
            </th>
            <th className='' scope='col'>
              Name
            </th>
            <th className='px-1 overflow-hidden' scope='col'>
              ROS Contract Signed
            </th>
            <th className='overflow-hidden' scope='col'>
              Applied to BCCNM
            </th>
            <th className='overflow-hidden' scope='col'>
              NCAS Assessment
            </th>
            <th className='overflow-hidden' scope='col'>
              Country of Education
            </th>
            <th className='text-center' scope='col'>
              Message
            </th>
            <th className='text-center' scope='col'>
              Application complete
            </th>
            <th className='text-center' scope='col'>
              Decision Date
            </th>
            <th className='text-center' scope='col'>
              BCCNM Full Licence LPN
            </th>
            <th className='text-center' scope='col'>
              BCCNM Full Licence RN
            </th>
            <th className='text-center' scope='col'>
              BCCNM Full Licence RPN
            </th>
            <th className='text-center' scope='col'>
              BCCNM Provisional Licence LPN
            </th>
            <th className='text-center' scope='col'>
              BCCNM Provisional Licence RN
            </th>
            <th className='text-center' scope='col'>
              BCCNM Provisional Licence RPN
            </th>
          </tr>
        </thead>
        <tbody className='text-bcBlack text-sm'>
          {data.map((update, idx) => (
            <tr key={`${update.id}-${idx}`} className='h-12 even:bg-bcLightGray'>
              <td className='px-3'>{update.id}</td>
              <td className='px-2'>{_.startCase(update.name)}</td>
              <td className='px-2'>{update.dateOfRosContract}</td>
              <td className='px-2'>{update.appliedToBccnm}</td>
              <td className='px-2'>{update.ncasCompleteDate}</td>
              <td className='px-2'>{update.countryOfEducation}</td>
              <td className={`px-2 ${!update.valid && 'text-bcRedError'}`}>{update.message}</td>
              <td className='px-2'>{update.bccnmApplicationCompleteDate}</td>
              <td className='px-2'>{update.bccnmDecisionDate}</td>
              <td className='px-2'>{update.bccnmFullLicenceLPN}</td>
              <td className='px-2'>{update.bccnmFullLicenceRN}</td>
              <td className='px-2'>{update.bccnmFullLicenceRPN}</td>
              <td className='px-2'>{update.bccnmProvisionalLicenceLPN}</td>
              <td className='px-2'>{update.bccnmProvisionalLicenceRN}</td>
              <td className='px-2'>{update.bccnmProvisionalLicenceRPN}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
