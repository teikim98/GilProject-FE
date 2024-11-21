'use client'
import { getUser } from '@/api/user'
import { User } from '@/types/types'
import { Camera, Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'

export default function Profile() {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("유저 정보 가져오기 시작");  // 함수 실행 확인
                const user = await getUser();
                console.log("받아온 유저 데이터:", user);
                setUser(user);
            } catch (error) {
                console.error("유저 정보 가져오기 실패:", error);  // 구체적인 에러 내용 확인
            }
        }
        fetchUser();
    }, [])



    return (
        <Card className='[w-350px]'>
            <CardHeader className='mb-4'>
                <div className='flex flex-row justify-between items-center'>
                    <div className="flex flex-row items-center">
                        <img src={user?.imageUrl} alt="" />
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center'>
                                <p className=' mr-2 font-bold'>
                                    {user?.nickName}
                                </p>
                                <p className='text-xs text-slate-500'>
                                    {user?.address}
                                </p>
                            </div>
                            <p className='text-xs text-slate-500'>{user?.comment}</p>
                        </div>
                    </div>
                    <Pencil className='align-top' />
                </div>
            </CardHeader>
            <CardContent className='mb-4'>
                <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-col items-center">
                        <p className='text-sm'>
                            내가 쓴 글
                        </p>
                        <p className='text-sm'>
                            14
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className='text-sm'>
                            받은 좋아요
                        </p>
                        <p className='text-sm'>
                            15
                        </p>
                    </div>
                    <div className="flex flex-col items-center"  >
                        <p className='text-sm'>
                            따라걷기
                        </p>
                        <p className='text-sm'>
                            14
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className='flex justify-center'>
                <Button>
                    정보 수정하기
                </Button>
            </CardFooter>
        </Card>
    )
}
