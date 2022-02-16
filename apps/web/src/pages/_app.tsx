import '../styles/globals.css';

import axios from 'axios';
import Head from 'next/head';

import type { AppProps } from 'next/app';
import { Footer, Header } from '@components';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Health Provider Registry for BC’s Emergency Response</title>
        <link rel='icon' href='/assets/img/bc_favicon.ico' />
      </Head>
      <div className='h-full flex flex-col'>
        <Header />
        <main className='flex-grow flex justify-center'>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
