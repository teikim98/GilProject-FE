'use client'

import { useEffect, useState } from 'react';
import { Camera, Loader2, Pencil, Users } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BackHeader from '@/components/layout/BackHeader';
import { getDetailProfile, updateProfileImage } from '@/api/user';
import { User } from '@/types/types';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import ValidateMessage from '@/components/auth/ValidateMessage';

export default function Page() {
    const [profileInfo, setProfileInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const detailData = await getDetailProfile();
                setProfileInfo(detailData);
                setError(null);
            } catch (err) {
                setError('프로필을 불러오는데 실패했습니다');
                console.error('프로필 조회 에러:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return (
            <div className='animate-fade-in flex flex-col pb-20'>
                <BackHeader content='마이 페이지' />
                <Card className="w-full border-0 shadow-none min-h-[200px] flex items-center justify-center">
                    <div className="text-destructive">{error}</div>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='animate-fade-in flex flex-col pb-20'>
                <BackHeader content='마이 페이지' />
                <Card className="w-full border-0 shadow-none min-h-[200px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">프로필 불러오는 중...</p>
                    </div>
                </Card>
            </div>
        );
    }

    const updatePassword = ()=>{
        router.push('/main/mypage/update/password')
    }

    const updateUserSave = ()=>{
        router.push('/main/mypage');
    }

    return (
        <div className='animate-fade-in flex flex-col pb-20'>
            <BackHeader content='마이 페이지' />
            <h2 className='mt-4 mb-4'>내 정보 수정</h2>
            <Card className="w-full border-0 shadow-none">
                <CardHeader className="px-6 pb-3">
                </CardHeader>
                <CardContent>
                    <div className=''>
                            <div className="flex flex-col">
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">프로필 이미지</span>
                                  <div className="relative">
                                    {profileInfo?.imageUrl ? (
                                    <img
                                        src={profileInfo.imageUrl}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    ) : (
                                    <Camera className="w-12 h-12 p-2 bg-muted rounded-full" />
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                         if (file && profileInfo) {
                                                updateProfileImage(profileInfo.id, file);
                                            }
                                            }}
                                        accept="image/*"
                                    />
                                  </div>
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">이름</span>
                                    <Input className='w-[50%] text-lg bg-gray-100 border-muted'
                                        name="name"
                                        value={profileInfo?.name}
                                        readOnly
                                    />
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">닉네임</span>
                                    <Input className='w-[50%] text-lg'
                                        name="nickName"
                                        value={profileInfo?.nickName}
                                        onChange={(e) => setProfileInfo(prev => ({ ...prev, nickName: e.target.value }))}
                                    />
                                    <Button
                                        onClick={() => {/* 닉네임 중복 체크*/ }}
                                        className="w-[20%]"
                                    >중복 체크</Button>
                                </div>
                                <ValidateMessage validCondition={true} message={"asdas"} />
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">이메일</span>
                                    <Input className='w-[50%] text-lg bg-gray-100 border-muted'
                                        name="email"
                                        value={profileInfo?.email}
                                        readOnly
                                    />
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">주소</span>
                                    <Input className='w-[50%] text-lg'
                                        name="address"
                                        value={profileInfo?.address || '주소 미설정'}
                                        readOnly
                                    />
                                    <Button
                                        onClick={()=>{/*주소 변경 컴포넌트*/}}
                                        className="w-[20%]"
                                    >주소 변경</Button>
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">자기소개</span>
                                    <Input className='w-[50%] text-lg'
                                        name="comment"
                                        value={profileInfo?.comment || ""}
                                        onChange={(e) => setProfileInfo(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder='자기소개가 없습니다'
                                    />
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">가입일자</span>
                                    <Input className='w-[50%] text-lg bg-gray-100 border-muted'
                                        name="comment"
                                        value={profileInfo?.joinDate.split("T")[0]}
                                        readOnly
                                    />
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-row items-center gap-10">
                                    <span className="font-bold text-lg">비밀번호</span>
                                    <Button
                                        onClick={updatePassword}
                                        className="w-[30%] bg-red-600 text-white hover:bg-red-700"
                                    >
                                    비밀번호 변경
                                    </Button>
                                </div>
                                <Separator className='my-5 border-t-2 border-muted-foreground' />
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    
                                </div>
                            </div>
                        </div>
                </CardContent>
                <CardFooter className="px-6 pt-0 flex justify-center">
                    <Button
                        onClick={updateUserSave}
                        className="w-[40%]"
                    >
                    수정 정보 저장
                    </Button>
                </CardFooter>
            </Card>
        
        </div>
    );
}