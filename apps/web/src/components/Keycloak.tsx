import { useAuthContext } from './AuthContexts';
import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import router from 'next/router';
import { ValidRoles } from '@services';
import { Pending } from './Pending';
import { Spinner } from './Spinner';
import { NextPage } from 'next';
import { toast } from 'react-toastify';

const withAuth = (Component: React.FunctionComponent, roles: ValidRoles[]) => {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    // Login data added to props via redux-store (or use react context for example)
    const { authUser, authUserLoading } = useAuthContext();
    const kc = useKeycloak();

    // eslint-disable-next-line
    useEffect(() => {
      if (kc?.initialized && authUser && !roles.includes(authUser?.role)) {
        toast.error('Users with admin role can access the page.');
        router.replace('/applicants');
      }
      if (!authUser && !authUserLoading && kc.initialized && !kc?.keycloak?.authenticated) {
        router.replace('/login');
      }
    }, [kc?.initialized, kc?.keycloak?.authenticated, authUser, authUserLoading]);

    // Handle intermediate states
    if (authUserLoading || !kc.initialized || !authUser || !authUser.role) {
      return <Spinner className='h-10 w-10' />;
    }

    // Show pending if the user hasn't been assigned a role
    if (authUser.role && !roles.includes(authUser.role)) {
      return (
        <main className='flex flex-col'>
          {/* <Navigation logoutOnly={true} /> */}
          <Pending />
        </main>
      );
    }
    // Finally, if all goes well, show the page the user is requesting
    return (
      <main className='flex flex-col'>
        {/* <Navigation logoutOnly={false} /> */}
        <Component {...props} />
      </main>
    );
  };

  // Copy getInitial props so it will run as well
  if ((Component as NextPage).getInitialProps) {
    Auth.getInitialProps = (Component as NextPage).getInitialProps;
  }

  return Auth;
};

export default withAuth;
