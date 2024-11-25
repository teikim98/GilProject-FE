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


const navigationItems = [
    { name: '마이 페이지', href: '/main/mypage' },
    { name: '내 경로', href: '/main/mypage/myRoute' },
    { name: '알림', href: '/notifications' },
    { name: '산책길 목록', href: '/main/board' },
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
                <SheetContent side="right" className="w-[350px]">
                    <SheetHeader>
                        <SheetTitle className="text-left">메뉴</SheetTitle>
                    </SheetHeader>
                    <nav className="mt-8">
                        <Profile />
                        <ul className="space-y-4">
                            {navigationItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "block px-4 py-2 text-lg rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-600",
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
