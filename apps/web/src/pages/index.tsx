import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'reflect-metadata';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/applicants');
  }, [router]);

  return null;
};

export default Home;
