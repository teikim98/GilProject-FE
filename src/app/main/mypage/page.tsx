'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/app/loading';
import Profile from '@/components/user/profile';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/layout/BackIcon';
import MypageBtn from '@/components/layout/MypageBtn';

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time, replace with actual data fetching or loading logic
        setTimeout(() => {
            setIsLoading(false);
        }, 500); // Adjust delay as needed
    }, []);

    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className='animate-fade-in flex flex-col'>
            <BackButton route='/main' />
            <h2 className='mt-4 mb-4'>프로필</h2>
            <Profile />
            <Separator className='my-4' />
            <MypageBtn link='myRoute' content='내 경로기록 보기' />
        </div>
    )
}
