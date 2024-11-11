import { Camera, Pencil } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'

export default function Profile() {
    return (
        <Card className='[w-350px]'>
            <CardHeader className='mb-4'>
                <div className='flex flex-row justify-between items-center'>
                    <div className="flex flex-row items-center">
                        <Camera className='mr-4' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center'>
                                <p className=' mr-2 font-bold'>
                                    김종국
                                </p>
                                <p className='text-xs text-slate-500'>
                                    구미동-214
                                </p>
                            </div>
                            <p className='text-xs text-slate-500'>저는 비빔인간 입니다 어쩌구...</p>
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
