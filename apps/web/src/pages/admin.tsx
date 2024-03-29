import { Access } from '@ien/common';
import withAuth from '../components/Keycloak';
import { AclMask, BccnmNcasSection, UserGuideSection } from '@components';

const AdminPage = () => {
  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-6 pb-1'>Admin / Maintenance</h1>
      <AclMask acl={[Access.BCCNM_NCAS]}>
        <BccnmNcasSection />
      </AclMask>
      {process.env.NEXT_PUBLIC_DISABLE_USER_GUIDE !== 'true' && (
        <AclMask acl={[Access.ADMIN]}>
          <UserGuideSection />
        </AclMask>
      )}
    </div>
  );
};

export default withAuth(AdminPage, [Access.ADMIN, Access.BCCNM_NCAS], false);
