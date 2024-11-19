'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ViewingMap } from '@/components/map/ViewingMapProps';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Position } from '@/types/types';

const calculateRouteDistance = (path: Position[]): number => {
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const point1 = path[i];
        const point2 = path[i + 1];

        const R = 6371; // 지구 반경 (km)
        const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
        const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((point1.lat * Math.PI) / 180) *
            Math.cos((point2.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        totalDistance += distance;
    }

    return Math.round(totalDistance * 10) / 10; // 소수점 첫째자리까지
};

interface SavedRoute {
    path: Position[];
    markers: Array<any>;
    recordedTime: number;
    distance: number;
    timestamp: string;
}

export default function TestFollowPage() {
    const router = useRouter();
    const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

    useEffect(() => {
        const savedPathsString = localStorage.getItem('savedRoutes');
        if (savedPathsString) {
            try {
                const parsed = JSON.parse(savedPathsString);
                if (Array.isArray(parsed)) {
                    setSavedRoutes(parsed);
                } else {
                    setSavedRoutes([parsed]);
                }
                console.log('Parsed routes:', parsed);
            } catch (error) {
                console.error('Failed to parse saved routes:', error);
            }
        }
    }, []);

    const handleRouteSelect = (index: number) => {
        setSelectedRouteIndex(index);
    };

    const handleStartTest = async () => {
        if (selectedRouteIndex === null) return;

        try {
            const selectedRoute = savedRoutes[selectedRouteIndex];
            const distance = selectedRoute.distance || calculateRouteDistance(selectedRoute.path);

            const testPost = {
                id: 999,
                userNickName: "테스트 사용자",
                pathId: 999,
                startLat: selectedRoute.path[0]?.lat || 0,
                startLong: selectedRoute.path[0]?.lng || 0,
                state: 1,
                title: `테스트 경로 ${new Date(selectedRoute.timestamp || Date.now()).toLocaleDateString()}`,
                content: "로컬스토리지에서 가져온 테스트 경로입니다.",
                tag: "테스트",
                writeDate: new Date().toISOString(),
                updateDate: new Date().toISOString(),
                readNum: 0,
                postLikesUsers: [],
                postLikesNum: 0,
                repliesUsers: [],
                repliesNum: 0,
                postWishListsUsers: [],
                postWishListsNum: 0,
                routeData: {
                    path: selectedRoute.path,
                    markers: selectedRoute.markers || [],
                    recordedTime: selectedRoute.recordedTime || 0,
                    distance: distance
                }
            };

            // 로컬스토리지에 저장
            window.localStorage.setItem('testRoute', JSON.stringify(testPost));

            // 잠시 대기 후 페이지 이동 (로컬스토리지 저장 완료 보장)
            setTimeout(() => {
                router.push('/follow/999');
            }, 100);

        } catch (error) {
            console.error('Failed to prepare test route:', error);
            alert('테스트 경로 준비 중 오류가 발생했습니다.');
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRouteDistance = (route: SavedRoute): number => {
        return route.distance || calculateRouteDistance(route.path);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4">따라걷기 테스트</h1>

            <ScrollArea className="h-[70vh]">
                <div className="space-y-4">
                    {savedRoutes.map((route, index) => {
                        const distance = getRouteDistance(route);

                        return (
                            <Card
                                key={index}
                                className={`p-4 cursor-pointer transition-colors ${selectedRouteIndex === index
                                    ? 'border-2 border-primary'
                                    : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => handleRouteSelect(index)}
                            >
                                <div className="mb-4">
                                    <h3 className="font-semibold">
                                        저장된 경로 #{index + 1}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {route.timestamp ? formatDate(route.timestamp) : '날짜 정보 없음'}
                                    </p>
                                </div>

                                <div className="h-[200px] mb-4">
                                    <ViewingMap
                                        route={{
                                            path: route.path,
                                            markers: route.markers || []
                                        }}
                                        width="w-full"
                                        height="h-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">총 거리: </span>
                                        <span className="font-medium">
                                            {distance.toFixed(2)}km
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">소요 시간: </span>
                                        <span className="font-medium">
                                            {Math.floor((route.recordedTime || 0) / 60)}분
                                            {(route.recordedTime || 0) % 60}초
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </ScrollArea>

            <Button
                className="w-full"
                onClick={handleStartTest}
                disabled={selectedRouteIndex === null}
            >
                선택한 경로로 테스트 시작
            </Button>
        </div>
    );
}