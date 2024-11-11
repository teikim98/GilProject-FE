'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Bell, Camera, Pencil } from 'lucide-react'
import React, { useState } from 'react'
import KakaoMap from '../providers/KakaoMap'
import PWAInstallButton from '@/components/layout/PwaInstallBtn';

const navigationItems = [
    { name: '홈', href: '/' },
    { name: '프로필', href: '/profile' },
    { name: '설정', href: '/settings' },
    { name: '알림', href: '/notifications' },
    { name: '로그아웃', href: '/logout' },
];

export default function page() {

    const pathname = usePathname();

    return (
        <div className='w-full animate-fade-in '>
            <div className='flex flex-row justify-between mb-8'>
                <Camera size={28} />
                <div className='flex flex-row'>
                    <Bell size={28} className='mr-2' />
                    <Sheet>
                        <SheetTrigger className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                            <HamburgerMenuIcon className="w-7 h-7" />
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-left">메뉴</SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8">
                                <ul className="space-y-4">
                                    {navigationItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block px-4 py-2 text-lg rounded-md transition-colors hover:bg-gray-100",
                                                    pathname === item.href && "bg-gray-100 font-medium"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
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

            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>
            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>
            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>
            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>
            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>
            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>
            <Card className='flex flex-row justify-between items-center p-4 mb-4'>
                <h1>내 주변 산책로 찾기</h1>
                <div className='bg-slate-400 w-12 h-12'></div>
            </Card>





        </div>
    )
}
