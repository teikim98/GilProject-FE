'use client';

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
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next'


const HomePage = () => {
    const router = useRouter()

    const handleLogin = () => {
        // 임시 인증 상태 설정
        setCookie('auth-status', 'authenticated', {
            maxAge: 60 * 60 * 24, // 24시간
            path: '/',
        })

        router.push('/main')
    }

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
                    <Button onClick={handleLogin} variant="outline" className='w-full'>Sign in</Button>
                    <h2>아직 회원이 아니라면 <a href="/auth/signup" className=' bg-slate-500'>여기를</a> 눌러 회원가입</h2>
                </CardFooter>
            </Card>

        </div>
    );
};

export default HomePage;
