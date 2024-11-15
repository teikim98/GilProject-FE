'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Pencil } from 'lucide-react'
import KakaoMap from '../providers/KakaoMap'
import PWAInstallButton from '@/components/layout/PwaInstallBtn';
import Sidemenu from '@/components/layout/Sidemenu'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/layout/DarkModeToggle'



export default function Page() {
    return (
        <div className='w-full animate-fade-in flex flex-col bg-white dark:bg-slate-800'>
            <div className='flex flex-row justify-between mb-8'>
                <h2 className='font-sebang text-3xl font-semibold text-purple-800 dark:text-purple-400'>
                    길따라
                </h2>
                <DarkModeToggle />
                <Sidemenu />
            </div>

            <Card className='flex items-center flex-col p-4 bg-white dark:bg-gray-800'>
                <CardContent className='w-full px-0'>
                    <KakaoMap width='w-full' height='h-48' />
                </CardContent>
                <div className='w-full flex flex-row justify-between'>
                    <h2 className='text-gray-900 dark:text-white'>
                        지금 경로 녹화 하러가기
                    </h2>
                    <Link href="/main/record">
                        <Pencil className="cursor-pointer hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
                    </Link>
                </div>
            </Card>

            <Separator className='my-4 dark:bg-gray-700' />

            <PWAInstallButton />

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
        </div>
    )
}
