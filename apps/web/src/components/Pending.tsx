import { useAuthContext } from './AuthContexts';

export const Pending: React.FC = () => {
  const { authUser } = useAuthContext();

  return (
    <div className='border-l-10 border-bcBluePrimary p-6 pb-5 md:pb-6 mb-5 bg-bcLightBackground text-left flex items-center'>
      {authUser?.revoked_access_date
        ? 'You are not authorized to use IEN system'
        : 'You have logged into IEN, but you have not been assigned a role'}
    </div>
  );
};
