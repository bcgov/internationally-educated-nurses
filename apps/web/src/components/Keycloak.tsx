import { useAuthContext } from './AuthContexts';
import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/ssr';
import router from 'next/router';
import { ValidRoles } from '@services';
import { Pending } from './Pending';
import { Spinner } from './Spinner';

const withAuth = (Component: any, roles: ValidRoles[]) => {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    // Login data added to props via redux-store (or use react context for example)
    const { authUser, authUserLoading } = useAuthContext();
    const kc = useKeycloak();

    // eslint-disable-next-line
    useEffect(() => {
      if (kc?.initialized && authUser && !roles.includes(authUser?.role)) {
        router.replace('/form');
      }
      if (!authUser && !authUserLoading && kc.initialized && !kc?.keycloak?.authenticated) {
        router.replace('/login');
      }
    }, [kc?.initialized, authUser, authUserLoading]);

    // Handle intermediate states
    if (
      authUserLoading ||
      !kc.initialized ||
      !authUser ||
      (authUser.role && !roles.includes(authUser.role))
    ) {
      return <Spinner className='h-10 w-10' />;
    }

    // Show pending if the user hasn't been assigned a role
    if (!authUser?.role) {
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
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
