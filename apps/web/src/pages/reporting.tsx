import { Access } from '@ien/common';
import { DataExtractReport, ReportTable, AclMask } from '@components';
import withAuth from '../components/Keycloak';
import { useIsHAUser } from 'src/components/AuthContexts';

const Reporting = () => {
  const { isHAUser } = useIsHAUser();
  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl my-5'>Reporting</h1>
      <AclMask acl={[Access.DATA_EXTRACT]}>
        <div className='bg-white p-5 rounded mb-5'>
          <DataExtractReport />
        </div>
      </AclMask>
      {/* HA User not seeing report table */}
      <AclMask acl={[Access.REPORTING]}>{!isHAUser && <ReportTable />}</AclMask>
    </div>
  );
};

export default withAuth(Reporting, [Access.REPORTING, Access.DATA_EXTRACT], false);
