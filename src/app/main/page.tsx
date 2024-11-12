'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { Camera, Pencil } from 'lucide-react'
import KakaoMap from '../providers/KakaoMap'
import PWAInstallButton from '@/components/layout/PwaInstallBtn';
import Sidemenu from '@/components/layout/Sidemenu'
import Link from 'next/link'
import Image from 'next/image'



export default function page() {


    return (
        <div className='w-full h-screen animate-fade-in '>
            <div className='flex flex-row justify-between mb-8'>
                <Camera size={28} />
                <Sidemenu />
            </div>
            <Card className='flex items-center flex-col p-4'>
                <CardContent className='w-full px-0'>
                    <KakaoMap width='w-full' height='h-48' mapId='1' />
                </CardContent>
                <div className='w-full flex flex-row justify-between'>
                    <h2>지금 경로 녹화 하러가기</h2>
                    <Pencil />
                </div>
            </Card>
            <Separator className='my-4' />
            <PWAInstallButton />

            <div className="flex flex-row justify-between h-1/4">
                <Link href="/main/board" className='w-[48%] block'>
                    <Card className='h-full cursor-pointer'>
                        <h2>내 주변 산책로 보러가기</h2>
                        <Image alt='animate-gif' src="/public/pubao.gif" width={200} height={200} unoptimized />
                    </Card>
                </Link>

                <Link href="/main/mypage/myRoute" className='w-[48%] block'>
                    <Card className='h-full cursor-pointer'>
                        <h2>내가 기록한 경로 브랜치 체크</h2>
                    </Card>
                </Link>
            </div>





        </div>
    )
}
