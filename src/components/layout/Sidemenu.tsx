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
import SideProfile from "../user/SidemenuProfile";
import { useDetailProfile } from "@/hooks/queries/useUserQuery";
import PWAInstallButton from "./PwaInstallBtn";


const navigationItems = [
    { name: '마이 페이지', href: '/main/mypage' },
    { name: '알림', href: '/main/notification' },
    { name: '나의 경로 기록', href: '/main/mypage/myRoute' },
    { name: '산책길 보기', href: '/main/board' },
];

export default function Sidemenu() {
    const pathname = usePathname();
    const router = useRouter();
    const notifications = useNotificationStore((state) => state.notifications);
    const unreadCount = notifications.filter(notification => notification.state === 0).length;
    const { data: profileInfo, isLoading, error } = useDetailProfile();


    const handleLogout = () => {
        logout();
        // router.push('/'); // 로그아웃 후 홈페이지로 이동
    };

    return (
        <div className='flex flex-row items-center'>
            <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-purple-100 dark:hover:bg-purple-600/40 transition-colors"
                onClick={() => router.push('/main/notification')}
            >
                <Bell className="h-7 w-7 text-purple-900 dark:text-purple-100" />
                {unreadCount > 0 && (
                    <div
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs"
                    >
                        {unreadCount}
                    </div>
                )}
            </Button>

            <Sheet>
                <SheetTrigger
                    className="p-[0.4rem] rounded-md hover:bg-purple-100 dark:hover:bg-purple-600/40 transition-colors"
                >
                    <HamburgerMenuIcon className="w-5 h-5 text-purple-900 dark:text-purple-100" />
                </SheetTrigger>

                <SheetContent side="right" className="w-[70%]">
                    <SheetHeader>
                        <SheetTitle className="text-left">메뉴</SheetTitle>
                    </SheetHeader>
                    <SideProfile
                        profileInfo={profileInfo ? {
                            nickName: profileInfo.nickName,
                            imageUrl: profileInfo.imageUrl,
                            postCount: profileInfo.postCount,
                            pathCount: profileInfo.pathCount,
                            subscribeByCount: profileInfo.subscribeByCount,
                            point: profileInfo.point,
                        } : null}
                        loading={isLoading}
                        error={error?.message ?? null}
                    />

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
                                <PWAInstallButton />
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-lg rounded-md transition-colors hover:bg-muted text-destructive dark:text-red-400"
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