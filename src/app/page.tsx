'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      router.push('/main');
    } else {
      router.push('/auth/login');
    }
  }, []);
};

export default Home;