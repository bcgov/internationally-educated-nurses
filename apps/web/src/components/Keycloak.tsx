import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from 'react-oidc-context';

import { Access, hasAccess } from '@ien/common';
import { getPath, isPending } from '@services';
import { Pending } from './Pending';
import { Spinner } from './Spinner';
import { useAuthContext } from './AuthContexts';

export const withAuth = (Component: React.FunctionComponent, acl: Access[], and = true) => {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    const { authUser, authUserLoading } = useAuthContext();
    const { isAuthenticated, isLoading } = useAuth();

    const router = useRouter();

    // eslint-disable-next-line
    useEffect(() => {
      if (!authUser && !authUserLoading && !isLoading && !isAuthenticated) {
        router.replace('/login');
      }

      if (authUser && !hasAccess(authUser.roles, acl, and)) {
        router.replace(getPath(authUser.roles));
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isAuthenticated, authUser, authUserLoading]);

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
      isLoading ||
      !authUser ||
      !authUser.roles ||
      !hasAccess(authUser.roles, acl, and)
    ) {
      return <Spinner size='2x' />;
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
