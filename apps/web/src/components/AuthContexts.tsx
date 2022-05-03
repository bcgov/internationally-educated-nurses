import { useKeycloak } from '@react-keycloak/ssr';
import axios from 'axios';
import { KeycloakInstance } from 'keycloak-js';
import React, { useEffect, useState } from 'react';
import { ValidRoles } from '@services';
import { useRouter } from 'next/router';

export interface UserType {
  id: string;
  name: string;
  keycloakId: string;
  createdDate: Date;
  role: ValidRoles;
}

const AuthContext = React.createContext<{
  authUser?: UserType;
  authUserLoading: boolean;
}>({ authUser: undefined, authUserLoading: false });

const AuthProvider = ({ children }: any) => {
  // eslint-disable-next-line
  const [authUser, setAuthUser] = useState<UserType | undefined>(undefined);
  const [authUserLoading, setAuthUserLoading] = useState(false);
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const router = useRouter();

  const keycloakId = keycloak?.idTokenParsed?.sub;

  const fetchData = async (id?: string) => {
    if (!id) return;
    setAuthUserLoading(true);
    const user = await getUser(id);
    setAuthUser(user);
    setAuthUserLoading(false);
  };

  useEffect(() => {
    if (keycloakId) {
      fetchData(keycloakId);
    } else if (authUser) {
      setAuthUser(undefined);
      router.push('/login');
    }
  }, [keycloakId]);

  const value = { authUser, authUserLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const getUser = async (keycloakId: string): Promise<UserType> => {
  const { data } = await axios.get(`/employee/${keycloakId}`);
  return data?.data;
};

function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuthContext };
