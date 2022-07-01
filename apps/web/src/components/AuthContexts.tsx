import { useKeycloak } from '@react-keycloak/ssr';
import axios from 'axios';
import { KeycloakInstance } from 'keycloak-js';
import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { ValidRoles } from '@ien/common';
import { useRouter } from 'next/router';

export interface UserType {
  id: string;
  name: string;
  keycloakId: string;
  createdDate: Date;
  role: ValidRoles;
  user_id: number;
  revoked_access_date: Date;
}

const AuthContext = React.createContext<{
  authUser?: UserType;
  authUserLoading: boolean;
}>({ authUser: undefined, authUserLoading: false });

const AuthProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const [authUser, setAuthUser] = useState<UserType | undefined>();
  const [authUserLoading, setAuthUserLoading] = useState(false);
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const router = useRouter();

  const keycloakId = keycloak?.idTokenParsed?.sub;

  const fetchData = async (id: string) => {
    setAuthUserLoading(true);
    const user = await getUser(id);
    if (user) {
      setAuthUser(user);
    }
    setAuthUserLoading(false);
  };

  useEffect(() => {
    if (keycloakId) {
      fetchData(keycloakId);
    } else if (authUser) {
      setAuthUser(undefined);
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keycloakId]);

  const value = { authUser, authUserLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const getUser = async (keycloakId: string): Promise<UserType | null> => {
  try {
    const { data } = await axios.get(`/employee/${keycloakId}`);
    return data?.data;
  } catch (e) {
    return null;
  }
};

function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuthContext };
