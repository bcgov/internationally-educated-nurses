import { Access } from '@ien/common';
import { DataExtractReport, ReportTable } from '@components';
import withAuth from '../components/Keycloak';
import { AclMask } from '../components/user/AclMask';

const Reporting = () => {
  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-6'>Reporting</h1>
      <p className='mt-2 mb-5'>
        All the reports are generated based on period. Available reports begin from April 1, 2021
      </p>
      <AclMask acl={[Access.DATA_EXTRACT]}>
        <div className='bg-white p-5 rounded mb-5'>
          <DataExtractReport />
        </div>
      </AclMask>
      <AclMask acl={[Access.REPORTING]}>
        <ReportTable />
      </AclMask>
    </div>
  );
};

export default withAuth(Reporting, [Access.REPORTING, Access.DATA_EXTRACT], false);
