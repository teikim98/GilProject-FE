'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const HomePage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full max-w-screen-md p-4 space-y-4 animate-fade-in">
            {/* Card Component */}
            <Card className="max-w-screen-md">
                <CardHeader>
                    <CardTitle>회원 가입</CardTitle>
                    <CardDescription>필요한 정보를 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Nickname</Label>
                                <Input id="name" placeholder="닉네임을 입력해주세요" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input id="email" name="email" placeholder="이메일을 입력해주세요" />
                            </div>
                            <div>
                                <Button className='w-full bg-slate-300 hover:bg-slate-500'>Continue with Google</Button>
                            </div>
                            <div>
                                <Button className='w-full bg-yellow-400 hover:bg-yellow-600'>Continue with Kakao</Button>
                            </div>
                            <div>
                                <Button className='w-full bg-blue-700 hover:bg-blue-900'>Continue with Facebook</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col">
                    <Button variant="outline" className='w-full'> <Link href="/main">Sign in</Link> </Button>
                    <h2>아직 회원이 아니라면 <a href="/auth/signup" className=' bg-slate-500'>여기를</a> 눌러 회원가입</h2>
                </CardFooter>
            </Card>

            {/* Dropdown Menu Component */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4">
                        Open Dropdown
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='min-w-fit'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => alert('Profile clicked')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert('Settings clicked')}>Settings</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert('Logout clicked')}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog Component */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        Open Dialog
                    </Button>
                </DialogTrigger>
                <DialogContent className=' w-2/3'>
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                        <p>This is a dialog content.</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HomePage;
