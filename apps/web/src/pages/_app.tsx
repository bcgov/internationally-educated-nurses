import axios from 'axios';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import { CachePolicies, Provider } from 'use-http';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { AuthProvider as OidcAuthProvider, AuthProviderProps, useAuth } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { NonceProvider } from 'react-select';

import { Footer, Header, MenuBar, Spinner } from '@components';
import { AuthProvider } from 'src/components/AuthContexts';
import { Maintenance } from '../components/Maintenance';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App({ Component, pageProps }: AppProps) {
  const [oidcConfig, setOidcConfig] = useState<AuthProviderProps>();

  useEffect(() => {
    setOidcConfig({
      authority: `${process.env.NEXT_PUBLIC_AUTH_URL}/realms/${process.env.NEXT_PUBLIC_AUTH_REALM}`,
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENTID ?? 'IEN',
      redirect_uri: window.origin,
      onSigninCallback: (user: User | void) => {
        if (user) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
        }
      },
    });
  }, []);

  const [nonce] = useState(getFormattedDate());

  if (process.env.NEXT_PUBLIC_MAINTENANCE) {
    return <Maintenance />;
  }

  if (!oidcConfig) {
    return <Spinner size='2x' />;
  }

  return (
    <>
      <Head>
        <title>Internationally Educated Nurses</title>
        <link rel='icon' href='/assets/img/bc_favicon.ico' />
      </Head>
      <OidcAuthProvider {...oidcConfig}>
        <FetchWrapper>
          <AuthProvider>
            <NonceProvider cacheKey='css' nonce={nonce}>
              <div className='h-full flex flex-col'>
                <Header />
                <MenuBar />
                <main className='flex w-full justify-center pb-20'>
                  <Component {...pageProps} />
                </main>
                <Footer />
              </div>
            </NonceProvider>
          </AuthProvider>
        </FetchWrapper>
      </OidcAuthProvider>
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

function FetchWrapper(props: PropsWithChildren) {
  const { user } = useAuth();

  return (
    <Provider
      url={process.env.NEXT_PUBLIC_API_URL}
      options={{
        interceptors: {
          request: async ({ options }) => {
            if (user?.access_token && options.headers) {
              (options.headers as Record<string, string>)['Authorization'] =
                `Bearer ${user.access_token}`;
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
