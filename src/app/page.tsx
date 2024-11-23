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

  return null; // 로딩 상태를 표시하거나 빈 화면을 유지
};

export default Home;