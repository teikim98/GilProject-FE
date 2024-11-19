'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ViewingMap } from '@/components/map/ViewingMapProps';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedRoute {
    path: Array<{ lat: number; lng: number; }>;
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
        // 로컬스토리지에서 저장된 경로들 가져오기
        const savedPathsString = localStorage.getItem('savedPath');
        if (savedPathsString) {
            try {
                // 문자열이 배열 형태인지 확인
                const parsed = JSON.parse(savedPathsString);
                if (Array.isArray(parsed)) {
                    setSavedRoutes(parsed);
                } else {
                    // 단일 객체인 경우 배열로 변환
                    setSavedRoutes([parsed]);
                }
            } catch (error) {
                console.error('Failed to parse saved routes:', error);
            }
        }
    }, []);

    const handleRouteSelect = (index: number) => {
        setSelectedRouteIndex(index);
    };

    const handleStartTest = () => {
        if (selectedRouteIndex === null) return;

        // 선택된 경로를 테스트용 Post 형식으로 변환하여 로컬스토리지에 저장
        const selectedRoute = savedRoutes[selectedRouteIndex];
        const testPost = {
            id: 999,
            userNickName: "테스트 사용자",
            pathId: 999,
            startLat: selectedRoute.path[0]?.lat || 0,
            startLong: selectedRoute.path[0]?.lng || 0,
            state: 1,
            title: `테스트 경로 ${new Date(selectedRoute.timestamp).toLocaleDateString()}`,
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
            routeData: selectedRoute
        };

        // 테스트용 데이터를 별도의 키로 저장
        localStorage.setItem('testRoute', JSON.stringify(testPost));
        router.push('/follow/999');
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

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4">따라걷기 테스트</h1>

            <ScrollArea className="h-[70vh]">
                <div className="space-y-4">
                    {savedRoutes.map((route, index) => (
                        <Card
                            key={route.timestamp}
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
                                    {formatDate(route.timestamp)}
                                </p>
                            </div>

                            <div className="h-[200px] mb-4">
                                <ViewingMap
                                    route={{
                                        path: route.path,
                                        markers: route.markers
                                    }}
                                    width="w-full"
                                    height="h-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">총 거리: </span>
                                    <span className="font-medium">
                                        {route.distance.toFixed(2)}km
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">소요 시간: </span>
                                    <span className="font-medium">
                                        {Math.floor(route.recordedTime / 60)}분
                                        {route.recordedTime % 60}초
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
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
