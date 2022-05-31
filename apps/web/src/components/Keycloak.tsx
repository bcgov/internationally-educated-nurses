import { useAuthContext } from './AuthContexts';
import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import { useRouter } from 'next/router';
import { ValidRoles } from '@ien/common';
import { Pending } from './Pending';
import { Spinner } from './Spinner';
import { NextPage } from 'next';

const withAuth = (Component: React.FunctionComponent, roles: ValidRoles[]) => {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    // Login data added to props via redux-store (or use react context for example)
    const { authUser, authUserLoading } = useAuthContext();
    const kc = useKeycloak();

    const router = useRouter();

    // eslint-disable-next-line
    useEffect(() => {
      if (kc?.initialized && authUser && authUser?.role === ValidRoles.MINISTRY_OF_HEALTH) {
        router.replace('/reporting');
      } else if (kc?.initialized && authUser && !roles.includes(authUser?.role)) {
        router.replace('/applicants');
      }
      if (!authUser && !authUserLoading && kc.initialized && !kc?.keycloak?.authenticated) {
        router.replace('/login');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kc?.initialized, kc?.keycloak?.authenticated, authUser, authUserLoading]);

    // Handle intermediate states
    if (authUserLoading || !kc.initialized || !authUser || !authUser.role) {
      return <Spinner className='h-10 w-10' />;
    }

    // Show pending if the user hasn't been assigned a role
    if (authUser.role && !roles.includes(authUser.role)) {
      return (
        <main className='flex w-full justify-center'>
          {/* <Navigation logoutOnly={true} /> */}
          <Pending />
        </main>
      );
    }
    // Finally, if all goes well, show the page the user is requesting
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if ((Component as NextPage).getInitialProps) {
    Auth.getInitialProps = (Component as NextPage).getInitialProps;
  }

  return Auth;
};

export default withAuth;
