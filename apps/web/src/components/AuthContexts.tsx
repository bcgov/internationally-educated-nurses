import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from 'react-oidc-context';
import { EmployeeRO } from '@ien/common';
import { getEmployee } from '@services';
import { getErrorMessage } from '../utils/get-error-message';

const AuthContext = React.createContext<{
  authUser?: EmployeeRO;
  authUserLoading: boolean;
}>({ authUser: undefined, authUserLoading: false });

const AuthProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const [authUser, setAuthUser] = useState<EmployeeRO | undefined>();
  const [authUserLoading, setAuthUserLoading] = useState(false);
  const { user, signoutSilent } = useAuth();
  const router = useRouter();

  axios.interceptors.response.use(
    res => res,
    async e => {
      const message = getErrorMessage(e);
      if (message?.includes('Authentication token')) {
        try {
          await signoutSilent();
        } catch (e) {
          window.location.replace(`${window.origin}/login`);
        }
      } else if (message) {
        toast.error(message);
      }
    },
  );

  const getUser = async () => {
    setAuthUserLoading(true);
    const user = await getEmployee();
    if (user) {
      setAuthUser(user);
    }
    setAuthUserLoading(false);
  };

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
      getUser();
    } else if (authUser) {
      setAuthUser(undefined);
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = { authUser, authUserLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuthContext };
