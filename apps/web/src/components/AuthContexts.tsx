import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const router = useRouter();

  const keycloakId = keycloak?.idTokenParsed?.sub;

  axios.interceptors.response.use(
    res => res,
    e => {
      const message = getErrorMessage(e);
      if (message?.includes('Authentication token')) {
        try {
          keycloak?.logout();
        } catch (e) {
          window.location.replace(`${window.location.origin}/login`);
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
    if (keycloakId) {
      getUser();
    } else if (authUser) {
      setAuthUser(undefined);
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keycloakId]);

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
