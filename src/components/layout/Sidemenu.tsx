import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react'
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Bell } from 'lucide-react'


const navigationItems = [
    { name: '홈', href: '/' },
    { name: '프로필', href: '/profile' },
    { name: '설정', href: '/settings' },
    { name: '알림', href: '/notifications' },
    { name: '로그아웃', href: '/logout' },
];

export default function Sidemenu() {

    const pathname = usePathname();

    return (
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
    )
}
