import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useKeycloak } from '@react-keycloak/ssr';
import { useRouter } from 'next/router';

import { ValidRoles } from '@ien/common';
import { Pending } from './Pending';
import { Spinner } from './Spinner';
import { useAuthContext } from './AuthContexts';

import { getPath, invalidRoleCheck, isPending } from '@services';

const withAuth = (Component: React.FunctionComponent, roles: ValidRoles[]) => {
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

      if (authUser && invalidRoleCheck(roles, authUser)) {
        router.replace(getPath(authUser));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kc?.initialized, kc?.keycloak?.authenticated, authUser, authUserLoading]);

    // Show pending if the user hasn't been assigned a role
    if (authUser && (isPending(authUser) || authUser.revoked_access_date)) {
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
      invalidRoleCheck(roles, authUser)
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
