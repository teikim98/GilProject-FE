'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FollowMap } from '@/components/map/FollowMap';
import { useFollowStore } from '@/store/useFollowStore';
import { getRouteById } from '@/api/route';
import { Post, Position } from '@/types/types';
import { calculatePathDistance } from '@/util/calculatePathDistance';
import { Navigation, AlertCircle, Trophy } from 'lucide-react';
import { ProgressDisplay } from '@/components/layout/ProgressDisplay';
import BackHeader from '@/components/layout/BackHeader';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface PostPageProps {
    params: {
        id: string;
    };
}


export default function FollowPage({ params }: PostPageProps) {
    const router = useRouter();
    const [route, setRoute] = useState<Post | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [isNearStart, setIsNearStart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        isFollowing,
        currentDistance,
        remainingDistance,
        currentSpeed,
        elapsedTime,
        isCompleted,
        startFollowing,
        stopFollowing,
        resetStatus
    } = useFollowStore();

    // 현재 위치와 시작점 사이의 거리 계산
    const checkDistanceToStart = (position: Position, startPosition: Position) => {
        const distance = calculatePathDistance([position, startPosition]); // km 단위
        return distance <= 0.02; // 20m = 0.02km
    };

    // 현재 위치 추적
    useEffect(() => {
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCurrentPosition(newPosition);

                    // 경로가 있는 경우, 시작점과의 거리 체크
                    if (route?.routeData.path[0]) {
                        const isNear = checkDistanceToStart(
                            newPosition,
                            route.routeData.path[0]
                        );
                        setIsNearStart(isNear);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('위치 정보를 가져올 수 없습니다.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
        }
    }, [route]);

    useEffect(() => {
        // 경로 완주시 Dialog 표시
        if (isCompleted) {
            setShowCompletionDialog(true);
            stopFollowing(); // 자동으로 따라걷기 중지
        }
    }, [isCompleted]);

    // 경로 데이터 로드
    useEffect(() => {
        const loadRoute = async () => {
            try {
                const data = await getRouteById(parseInt(params.id));
                setRoute(data);
            } catch (err) {
                setError('경로를 불러오는데 실패했습니다.');
                console.error('Failed to load route:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRoute();

        return () => {
            resetStatus();
        };
    }, [params.id]);

    const handleFollowToggle = () => {
        if (isFollowing) {
            stopFollowing();
        } else {
            startFollowing();
        }
    };
    const [showCompletionDialog, setShowCompletionDialog] = useState(false);



    const handleCompletionConfirm = () => {
        setShowCompletionDialog(false);
        router.push('/'); // 메인 페이지로 이동
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}분 ${remainingSeconds}초`;
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!route) return <div>경로를 찾을 수 없습니다.</div>;

    return (
        <div className='animate-fade-in flex flex-col relative h-full'>
            <BackHeader content='따라걷기' />
            <div className='px-4 space-y-4'>
                <FollowMap
                    route={route}
                    width="w-full"
                    height="h-[60vh]"
                />

                <div className='grid grid-cols-2 gap-4'>
                    <div className='p-4 rounded-lg'>
                        <h3 className='text-sm'>현재 속도</h3>
                        <p className='text-lg font-bold'>{currentSpeed.toFixed(1)}m/s</p>
                    </div>
                    <div className='p-4 rounded-lg'>
                        <h3 className='text-sm'>경과 시간</h3>
                        <p className='text-lg font-bold'>{formatTime(elapsedTime)}</p>
                    </div>
                </div>

                {!isNearStart && !isFollowing && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>시작 위치 확인</AlertTitle>
                        <AlertDescription>
                            경로의 시작 지점으로 이동해주세요. (20m 이내)
                        </AlertDescription>
                    </Alert>
                )}



                <ProgressDisplay />

                <Button
                    className={`w-full ${isFollowing ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={handleFollowToggle}
                    disabled={!isFollowing && !isNearStart}
                    size="lg"
                >
                    <Navigation className="w-5 h-5 mr-2" />
                    {isFollowing ? '따라걷기 중지하기' : '따라걷기 시작하기'}
                </Button>

                <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-center gap-2 text-xl">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                축하합니다! 🎉
                            </DialogTitle>
                            <DialogDescription className="text-center pt-4 text-base">
                                경로를 완주하셨습니다!
                                <br />
                                총 소요 시간: {formatTime(elapsedTime)}
                                <br />
                                이동 거리: {(currentDistance / 1000).toFixed(2)}km
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-center">
                            <Button
                                onClick={handleCompletionConfirm}
                                className="w-full"
                            >
                                확인
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


            </div>
        </div>
    );
}