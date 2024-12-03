'use client'

import { Camera, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import MypageBtn from '@/components/layout/MypageBtn';
import BackHeader from '@/components/layout/BackHeader';
import { getDetailProfile, updateProfileImage } from '@/api/user';
import { User } from '@/types/types';
import { getPoint } from '@/api/point';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDetailProfile } from '@/hooks/queries/useUserQuery';
import SubscriberDialog from '@/components/subscribe/SubscriberDialog';
import PointDialog from '@/components/point/PointDialog';

export default function Page() {

    const [points, setPoints] = useState(0);
    const [isPointDialogOpen, setIsPointDialogOpen] = useState(false);
    const [isSubscriberDialogOpen, setIsSubscriberDialogOpen] = useState(false);

    const router = useRouter();
    const { data: profileInfo, isLoading, error } = useDetailProfile();


    useEffect(() => {
        const getPoints = async () => {
            try {
                const pointData = await getPoint();
                setPoints(pointData);
            } catch (error) {
                console.error('포인트 조회 실패:', error);
            }
        };

        getPoints();
    }, []);

    if (error) {
        return (
            <div className='animate-fade-in flex flex-col pb-20'>
                <BackHeader content='마이 페이지' />
                <Card className="w-full border-0 shadow-none min-h-[200px] flex items-center justify-center">
                    <div className="text-destructive">{error.message}</div>
                </Card>
            </div>
        );
    }

    if (isLoading) {
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

    if (!profileInfo) {
        return (
            <div className='animate-fade-in flex flex-col pb-20'>
                <BackHeader content='마이 페이지' />
                <Card className="w-full border-0 shadow-none min-h-[200px] flex items-center justify-center">
                    <div className="text-muted-foreground">프로필 정보를 불러올 수 없습니다</div>
                </Card>
            </div>
        );
    }

    const updateUserInfo = () => {
        router.push("/main/mypage/update");
    }


    return (
        <div className='animate-fade-in flex flex-col pb-20'>
            <BackHeader content='마이 페이지' />
            <Card className="w-full border-0 shadow-none">
                <CardHeader className="px-6 pb-3">
                    <div className="flex flex-row justify-between items-start">
                        <div className="flex flex-row gap-4 items-center">
                            <div className="relative">
                                <div className={`medal w-20 h-20 rounded-full p-1
                                ${points >= 5000 ? 'bg-[url(/medal/gold.png)]' : points >= 3000 ? 'bg-[url(/medal/silver.png)]' : points >= 1000 ? 'bg-[url(/medal/bronze.png)]' : null} bg-cover bg-center`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {profileInfo?.imageUrl ? (
                                            <img
                                                src={profileInfo.imageUrl}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover"
                                                style={{ position: "absolute", transform: "translate(-50%, -50%)", top: "60%", left: "50%" }}
                                            />
                                        ) : (
                                            <Camera className="w-12 h-12 p-2 bg-muted rounded-full" style={{ position: "absolute", transform: "translate(-50%, -50%)", top: "60%", left: "50%" }} />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            updateProfileImage(profileInfo.id, file);
                                        }
                                    }}
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center gap-2">
                                    <p className="font-bold text-lg text-foreground">
                                        {profileInfo.nickName}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {profileInfo.address || '주소 미설정'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                        {profileInfo.comment || '자기소개가 없습니다'}
                    </p>
                </CardHeader>
                <CardContent className="px-6 pb-3">
                    <div className="w-full flex flex-row justify-between border rounded-lg p-4 bg-muted/50">
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground">내가 쓴 글</p>
                            <p className="text-lg font-semibold text-foreground">
                                {profileInfo.postCount}
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground">따라걷기 수</p>
                            <p className="text-lg font-semibold text-foreground">
                                {profileInfo.pathCount}
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-muted-foreground">구독자 수</p>
                            <p className="text-lg font-semibold text-foreground">
                                {profileInfo.subscribeByCount}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-6 pt-0 flex justify-center">
                    <Button
                        onClick={updateUserInfo}
                        className="w-[50%]"
                    >
                        정보 수정하기
                    </Button>
                </CardFooter>
            </Card>
            <Separator className='my-4' />
            <MypageBtn link='myRoute' content='나의 경로 기록' /> <br />
            <MypageBtn link='myPost' content='내가 작성한 산책길 글 목록' /> <br />
            <MypageBtn link='myWishListPost' content='내가 찜한 산책길 글 목록' /> <br />

            <MypageBtn
                link='mySubscribers'
                content='내가 구독한 유저목록'
                onClick={() => setIsSubscriberDialogOpen(true)}
            /> <br />

            <MypageBtn
                link='point'
                content='나의 포인트'
                onClick={() => setIsPointDialogOpen(true)}
            />

            <PointDialog
                isOpen={isPointDialogOpen}
                onOpenChange={setIsPointDialogOpen}
            />

            <SubscriberDialog
                isOpen={isSubscriberDialogOpen}
                onOpenChange={setIsSubscriberDialogOpen}
            />
        </div>
    );
}