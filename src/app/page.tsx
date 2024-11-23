import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access'); // 토큰 키 확인
    if (token) {
      router.replace('/main'); // 메인 페이지로 리디렉션
    } else {
      router.replace('/auth/login'); // 로그인 페이지로 리디렉션
    }
  }, [router]);

  return null; // 로딩 상태를 표시하거나 빈 화면을 유지
};

export default Home;