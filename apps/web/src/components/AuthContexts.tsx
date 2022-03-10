import { useKeycloak } from '@react-keycloak/ssr';
import axios from 'axios';
import { KeycloakInstance } from 'keycloak-js';
import React, { useEffect, useState } from 'react';
import { ValidRoles } from '@services';

export interface UserType {
  id: string;
  username: string;
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
  const keycloakId = keycloak?.idTokenParsed?.sub;

  useEffect(() => {
    const fetchData = async () => {
      setAuthUserLoading(true);
      const user = await getUser(keycloakId || '');
      setAuthUser(user);
      setAuthUserLoading(false);
    };
    if (keycloakId) {
      fetchData();
    }
  }, [keycloakId]);

  const value = { authUser, authUserLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const getUser = async (keycloakId: string): Promise<UserType> => {
  const { data } = await axios.get(`/employee/${keycloakId}`);
  return data;
};

function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuthContext };
