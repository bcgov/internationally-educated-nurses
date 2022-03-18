import { SSRKeycloakProvider, SSRCookies, useKeycloak } from '@react-keycloak/ssr';
import '../styles/globals.css';

import axios from 'axios';
import Head from 'next/head';

import type { AppProps } from 'next/app';
import { Footer, Header } from '@components';
import cookie from 'cookie';
import { AuthProvider } from 'src/components/AuthContexts';
import { KeycloakInstance } from 'keycloak-js';
import { CachePolicies, Provider } from 'use-http';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const keycloakConfig = {
  realm: process.env.NEXT_PUBLIC_AUTH_REALM || 'ien',
  url: process.env.NEXT_PUBLIC_AUTH_URL || 'https://keycloak.freshworks.club/auth',
  clientId: process.env.NEXT_PUBLIC_AUTH_CLIENTID || 'IEN',
};

function App({ Component, pageProps }: AppProps) {
  const handleTokens = (tokens: any) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.token}`;
  };
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
              <main className='flex-grow flex justify-center'>
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </FetchWrapper>
      </SSRKeycloakProvider>
    </>
  );
}

function FetchWrapper(props: any) {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  return (
    <Provider
      url={process.env.NEXT_PUBLIC_API_URL}
      options={{
        interceptors: {
          request: async ({ options }: any) => {
            if (keycloak?.token) {
              options.headers['Authorization'] = `Bearer ${keycloak.token}`;
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
