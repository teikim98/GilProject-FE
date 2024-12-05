'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FollowMap } from '@/components/map/FollowMap';
import { useFollowStore } from '@/store/useFollowStore';
import { getRouteById } from '@/api/route';
import { Path, Post, RouteCoordinate } from '@/types/types';
import { calculatePathDistance, calculateRouteDistance } from '@/util/calculatePathDistance';
import { Navigation, AlertCircle } from 'lucide-react';
import { ProgressDisplay } from '@/components/layout/ProgressDisplay';
import BackHeader from '@/components/layout/BackHeader';
import { useRouter } from 'next/navigation';
import CelebrationAnimation from '@/components/layout/CelebrationAnimation ';
import { updateUserPoints } from '@/api/user';

// 페이지 props 인터페이스
type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}


function checkDistanceToStart(position: RouteCoordinate, startPosition: RouteCoordinate): boolean {
    const distance = calculateRouteDistance([position, startPosition]);
    return distance <= 0.02; // 20m = 0.02km
}


export default function FollowPage({ params }: Props) {
    const router = useRouter();
    const [route, setRoute] = useState<Path | null>(null);
    const [currentPosition, setCurrentPosition] = useState<RouteCoordinate | null>(null);
    const [isNearStart, setIsNearStart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCompletionDialog, setShowCompletionDialog] = useState(false);
    const [pointsUpdated, setPointsUpdated] = useState(false);




    const {
        isFollowing,
        currentDistance,
        remainingDistance,
        currentSpeed,
        elapsedTime,
        isCompleted,
        startFollowing,
        stopFollowing,
        resetStatus,
        setOriginalRoute
    } = useFollowStore();


    // 현재 위치 추적
    useEffect(() => {
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newPosition: RouteCoordinate = {
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    };
                    setCurrentPosition(newPosition);

                    // 경로가 있는 경우, 시작점과의 거리 체크
                    if (route?.routeCoordinates[0]) {
                        const isNear = checkDistanceToStart(
                            newPosition,
                            route.routeCoordinates[0]
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
        const handleCompletion = async () => {
            if (isCompleted && !pointsUpdated && route) {
                try {
                    await updateUserPoints(route.id);
                    setPointsUpdated(true);
                    setShowCompletionDialog(true);
                    stopFollowing();
                } catch (error) {
                    console.error('포인트 업데이트 실패:', error);
                    setError('포인트 지급 중 오류가 발생했습니다.');
                }
            }
        };

        handleCompletion();
    }, [isCompleted, pointsUpdated, route, stopFollowing]);

    // 경로 데이터 로드
    useEffect(() => {
        const loadRoute = async () => {
            try {
                const data = await getRouteById(parseInt(params.id));
                setRoute(data);
                setOriginalRoute(data);
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
    }, [params.id, resetStatus, setOriginalRoute]);

    const handleFollowToggle = () => {
        if (isFollowing) {
            stopFollowing();
        } else {
            startFollowing();
        }
    };



    const formatTime = (seconds: number): string => {
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


                {showCompletionDialog && (
                    <CelebrationAnimation
                        elapsedTime={useFollowStore.getState().finalTime || elapsedTime}
                        distance={currentDistance}
                        onConfirm={() => {
                            setShowCompletionDialog(false);
                            router.push('/main');
                        }}
                    />
                )}
            </div>
        </div>
    );
}