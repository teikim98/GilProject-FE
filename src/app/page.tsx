'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  console.log("루트의 홈으로 도착");
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      console.log("메인으로 이동");
      router.push('/main');
    } else {
      console.log("로그인으로 이동");
      router.push('/auth/login');
    }
  }, []);
};

export default Home;