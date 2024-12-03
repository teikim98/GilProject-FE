'use client'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Bell } from 'lucide-react'
import Profile from "../user/profile";
import { logout } from "@/api/user";
import { useRouter } from 'next/navigation';
import { useNotificationStore } from "@/store/useNotificationStore";
import { Button } from "../ui/button";


const navigationItems = [
    { name: '마이 페이지', href: '/main/mypage' },
    { name: '내 경로', href: '/main/mypage/myRoute' },
    { name: '알림', href: '/main/notification' },
    { name: '산책길 목록', href: '/main/board' },
];

export default function Sidemenu() {
    const pathname = usePathname();
    const router = useRouter();
    const notifications = useNotificationStore((state) => state.notifications);
    const unreadCount = notifications.length;


    const handleLogout = () => {
        logout();
        // router.push('/'); // 로그아웃 후 홈페이지로 이동
    };

    return (
        <div className='flex flex-row items-center'>
            <Button
                variant="ghost"
                size="icon"
                className="relative mr-2"
                onClick={() => router.push('/main/notification')}
            >
                <Bell className="h-7 w-7" />
                {unreadCount > 0 && (
                    <div
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs"
                    >
                        {unreadCount}
                    </div>

                )}
            </Button>

            <Sheet>
                <SheetTrigger className="hover:bg-muted p-1 rounded-full transition-colors">
                    <HamburgerMenuIcon className="w-7 h-7" />
                </SheetTrigger>
                <SheetContent side="right" className="w-[350px]">
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
                                            "block px-4 py-2 text-lg rounded-md transition-colors hover:bg-muted",
                                            pathname === item.href && "bg-muted font-medium",
                                            item.href === '/notifications' && unreadCount > 0 && "flex justify-between items-center"
                                        )}
                                    >
                                        {item.name}
                                        {item.href === '/main/notification' && unreadCount > 0 && (
                                            <div className="w-6 ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                                                {unreadCount}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-lg rounded-md transition-colors hover:bg-muted text-destructive"
                                >
                                    로그아웃
                                </button>
                            </li>
                        </ul>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

    )
}