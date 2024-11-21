'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Pencil } from 'lucide-react'
import PWAInstallButton from '@/components/layout/PwaInstallBtn';
import Sidemenu from '@/components/layout/Sidemenu'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/layout/DarkModeToggle'
import { CurrentLocationMap } from '@/components/map/CurrentLocationMap'
import { useEffect } from 'react'



export default function Page() {
    useEffect(()=>{
        console.log("main 도착");
        //쿠키 확인
        const getCookie = (name :any) => {
            const value = `; ${document.cookie}`; // 쿠키 문자열 앞에 ;를 추가하여 구분하기 쉽게 만듦
            const parts = value.split(`; ${name}=`); // name=토큰을 기준으로 분할
            if (parts.length === 2) {
                return parts.pop().split(';').shift(); // ;로 끝나는 부분을 제거하여 값만 리턴
            }
            return null; // 쿠키가 없으면 null 리턴
        };
        
        const token = getCookie('authorization');
        console.log(token);

            //있으면
            if(token){
                //로컬스토리지에 저장
                localStorage.setItem("access",token);
                //쿠키 삭제
                document.cookie = 'authorization=; Max-Age=0'; 

            }
            else{
            //없으면
                //아무일안함
                console.log("쿠키가 없습니다");
            }

    });

    return (
        <div className='w-full animate-fade-in flex flex-col bg-white dark:bg-gray-900 pb-20'>
            <div className='flex flex-row justify-between mb-8'>
                <h2 className='font-sebang text-3xl font-semibold text-purple-800 dark:text-purple-400'>
                    길따라
                </h2>
                <DarkModeToggle />
                <Sidemenu />
            </div>

            <Card className='flex items-center flex-col p-4 bg-white dark:bg-gray-800'>
                <CardContent className='w-full px-0'>
                    <CurrentLocationMap width='w-full' height='h-48' />
                </CardContent>
                <div className='w-full flex flex-row justify-between'>
                    <h2 className='text-gray-900 dark:text-white'>
                        지금 경로 녹화 하러가기
                    </h2>
                    <Link href="/record">
                        <Pencil className="cursor-pointer hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
                    </Link>
                </div>
            </Card>

            <Link href='/test' className='text-lg font-semibold'>경로 따라가기 테스트하기</Link>

            <Separator className='my-4 dark:bg-gray-700' />

            <PWAInstallButton />
            <div className="flex flex-col">
                <div className="flex flex-row justify-between" style={{ height: '20vh' }}>
                    <Link href="/main/board" className='w-[48%] block'>
                        <Card className='h-full cursor-pointer flex flex-col items-center justify-evenly relative overflow-hidden bg-[url("/pubao.gif")] bg-cover bg-center bg-no-repeat
                dark:before:content-[""] dark:before:absolute dark:before:inset-0 dark:before:bg-black/20'>
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="relative z-10 h-full p-4 flex items-center justify-center">
                                <h2 className="text-white font-semibold text-lg">
                                    내 주변 산책로 보러가기
                                </h2>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/main/mypage/myRoute" className='w-[48%] block'>
                        <Card className='h-full cursor-pointer flex flex-col items-center justify-evenly relative overflow-hidden bg-[url("/bird.gif")] bg-cover bg-center bg-no-repeat
                dark:before:content-[""] dark:before:absolute dark:before:inset-0 dark:before:bg-black/20'>
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="relative z-10 h-full p-4 flex items-center justify-center">
                                <h2 className="text-white font-semibold text-lg">
                                    내가 기록한 <br /> 산책로 보러가기
                                </h2>
                            </div>
                        </Card>
                    </Link>

                </div>
                <Link href="/main/board/post" className='w-[100%] block mt-4'>
                    <Card className='h-28 cursor-pointer flex flex-col items-center justify-evenly relative overflow-hidden bg-[url("/share.webp")] bg-cover bg-center bg-no-repeat
                dark:before:content-[""] dark:before:absolute dark:before:inset-0 dark:before:bg-black/20'>
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative z-10 h-full p-4 flex items-center justify-center">
                            <h2 className="text-white font-semibold text-lg">
                                내 산책길 공유하기
                            </h2>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
