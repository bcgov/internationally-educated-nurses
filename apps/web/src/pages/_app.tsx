import { SSRKeycloakProvider, SSRCookies, useKeycloak } from '@react-keycloak/ssr';
import axios from 'axios';
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import cookie from 'cookie';
import { KeycloakInstance } from 'keycloak-js';
import { CachePolicies, Provider } from 'use-http';
import { AuthClientTokens } from '@react-keycloak/core/lib/types';
import { PropsWithChildren, ReactNode } from 'react';

import { Footer, Header, MenuBar } from '@components';
import { AuthProvider } from 'src/components/AuthContexts';
import { Maintenance } from '../components/Maintenance';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.interceptors.response.use(
  res => res,
  e => {
    if (e?.response?.data?.errorType) {
      toast.error(`${e.response.data.errorType}: ${e.response.data.errorMessage}`);
    } else {
      toast.error(e.message);
    }
  },
);

const keycloakConfig = {
  realm: process.env.NEXT_PUBLIC_AUTH_REALM || 'moh_applications',
  url: process.env.NEXT_PUBLIC_AUTH_URL || 'https://common-logon-dev.hlth.gov.bc.ca/auth',
  clientId: process.env.NEXT_PUBLIC_AUTH_CLIENTID || 'IEN',
};

function App({ Component, pageProps }: AppProps) {
  const handleTokens = (tokens: AuthClientTokens) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.token}`;
  };

  if (process.env.NEXT_PUBLIC_MAINTENANCE) {
    return <Maintenance />;
  }
  return (
    <>
      <Head>
        <title>Internationally Educated Nurses</title>
        <link rel='icon' href='/assets/img/bc_favicon.ico' />
      </Head>
      <SSRKeycloakProvider
        keycloakConfig={keycloakConfig}
        persistor={SSRCookies(cookie)}
        onTokens={handleTokens}
        initOptions={{
          pkceMethod: 'S256',
          checkLoginIframe: false,
        }}
      >
        {' '}
        <FetchWrapper>
          <AuthProvider>
            <div className='h-full flex flex-col'>
              <Header />
              <MenuBar />
              <main className='flex w-full justify-center pb-12'>
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </FetchWrapper>
      </SSRKeycloakProvider>
      <ToastContainer
        style={{ width: '50%' }}
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </>
  );
}

function FetchWrapper(props: PropsWithChildren<ReactNode>) {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  return (
    <Provider
      url={process.env.NEXT_PUBLIC_API_URL}
      options={{
        interceptors: {
          request: async ({ options }) => {
            if (keycloak?.token && options.headers) {
              (options.headers as { [key: string]: string })[
                'Authorization'
              ] = `Bearer ${keycloak.token}`;
            }
            return options;
          },
        },
        cachePolicy: CachePolicies.NO_CACHE,
      }}
    >
      {props.children}
    </Provider>
  );
}

export default App;
