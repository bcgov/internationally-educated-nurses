import { Access } from '@ien/common';
import { DataExtractReport, AclMask } from '@components';
import withAuth from '../components/Keycloak';

const Reporting = () => {
  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl my-5'>Reporting</h1>
      <AclMask acl={[Access.DATA_EXTRACT]}>
        <div className='bg-white p-5 rounded mb-5'>
          <DataExtractReport />
        </div>
      </AclMask>
    </div>
  );
};

export default withAuth(Reporting, [Access.REPORTING, Access.DATA_EXTRACT], false);
