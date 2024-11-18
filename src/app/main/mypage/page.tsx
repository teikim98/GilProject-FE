'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/app/loading';
import Profile from '@/components/user/profile';
import { Separator } from '@/components/ui/separator';
import MypageBtn from '@/components/layout/MypageBtn';
import BackHeader from '@/components/layout/BackHeader';

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className='animate-fade-in flex flex-col pb-20'>
            <BackHeader content='마이 페이지' />
            <h2 className='mt-4 mb-4'>프로필</h2>
            <Profile />
            <Separator className='my-4' />
            <MypageBtn link='myRoute' content='내 경로기록 보기' />
        </div>
    )
}
