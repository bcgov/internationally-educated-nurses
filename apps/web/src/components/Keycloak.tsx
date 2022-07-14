import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useKeycloak } from '@react-keycloak/ssr';
import { useRouter } from 'next/router';

import { Pending } from './Pending';
import { Spinner } from './Spinner';
import { useAuthContext } from './AuthContexts';

import { getPath, isPending } from '@services';
import { Access, hasAccess } from '@ien/common';

const withAuth = (Component: React.FunctionComponent, acl: Access[]) => {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    // Login data added to props via redux-store (or use react context for example)
    const { authUser, authUserLoading } = useAuthContext();
    const kc = useKeycloak();

    const router = useRouter();

    // eslint-disable-next-line
    useEffect(() => {
      if (!authUser && !authUserLoading && kc.initialized && !kc?.keycloak?.authenticated) {
        router.replace('/login');
      }

      if (authUser && !hasAccess(authUser.roles, acl)) {
        router.replace(getPath(authUser.roles));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kc?.initialized, kc?.keycloak?.authenticated, authUser, authUserLoading]);

    // Show pending if the user hasn't been assigned a role
    if (authUser && (isPending(authUser.roles) || authUser.revoked_access_date)) {
      return (
        <main className='flex w-full justify-center'>
          {/* <Navigation logoutOnly={true} /> */}
          <Pending />
        </main>
      );
    }

    // Handle intermediate states
    if (
      authUserLoading ||
      !kc.initialized ||
      !authUser ||
      !authUser.roles ||
      !hasAccess(authUser.roles, acl)
    ) {
      return <Spinner className='h-10 w-10' />;
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
