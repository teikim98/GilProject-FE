// pages/test-follow/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ViewingMap } from '@/components/map/ViewingMapProps';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pin, Post, RouteCoordinate } from '@/types/types';

interface SavedPathData {
    path: RouteCoordinate[];
    pins: Pin[];  // markers -> pins
    time?: number;  // recordedTime -> time
}


interface SavedRoute {
    title: string;
    description: string;
    pathData: SavedPathData;
    createdAt: string;
}

// 좌표 형식 통일 함수
const normalizeCoordinates = (path: RouteCoordinate[]): RouteCoordinate[] => {
    return path.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude
    }));
};

const calculateRouteDistance = (path: RouteCoordinate[]): number => {
    if (!path || path.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const point1 = {
            lat: parseFloat(path[i].latitude),
            lng: parseFloat(path[i].longitude)
        };
        const point2 = {
            lat: parseFloat(path[i + 1].latitude),
            lng: parseFloat(path[i + 1].longitude)
        };

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

    return Math.round(totalDistance * 10) / 10;
};

export default function TestFollowPage() {
    const router = useRouter();
    const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadSavedRoutes = () => {
            const savedPathsString = localStorage.getItem('savedRoutes');
            if (savedPathsString) {
                try {
                    const parsed = JSON.parse(savedPathsString);
                    console.log('Parsed routes:', parsed);

                    // 배열인지 확인하고 필터링
                    const routes = Array.isArray(parsed) ?
                        parsed.filter(route => route?.pathData?.path?.length > 0) : [];

                    setSavedRoutes(routes);
                } catch (error) {
                    console.error('Failed to parse saved routes:', error);
                }
            }
        };

        loadSavedRoutes();
    }, []);

    const handleStartTest = () => {
        if (selectedRouteIndex === null) return;

        try {
            const selectedRoute = savedRoutes[selectedRouteIndex];
            const normalizedPath = normalizeCoordinates(selectedRoute.pathData.path);

            if (normalizedPath.length === 0) {
                throw new Error('No valid coordinates in path');
            }

            const distance = calculateRouteDistance(normalizedPath);

            const testPost: Post = {
                postId: 999,
                nickName: "테스트 사용자",
                pathId: 999,
                startLat: parseFloat(normalizedPath[0].latitude),
                startLong: parseFloat(normalizedPath[0].longitude),
                state: 1,
                title: selectedRoute.title || "테스트 경로",
                content: selectedRoute.description || "테스트 경로입니다.",
                tag: "테스트",
                writeDate: selectedRoute.createdAt,
                updateDate: selectedRoute.createdAt,
                readNum: 0,
                likesCount: 0,
                repliesCount: 0,
                postWishListsNum: 0,
                userImgUrl: "",
                pathResDTO: {
                    id: 999,
                    user: { id: 0 },
                    content: selectedRoute.description,
                    state: 0,
                    title: selectedRoute.title,
                    time: selectedRoute.pathData.time || 0,
                    distance: distance,
                    createDate: selectedRoute.createdAt,
                    startLat: parseFloat(normalizedPath[0].latitude),
                    startLong: parseFloat(normalizedPath[0].longitude),
                    startAddr: null,
                    routeCoordinates: normalizedPath,
                    pins: selectedRoute.pathData.pins
                },
                imageUrls: [],
                liked: false,
                wishListed: false,
                postUserId: 0
            };


            window.localStorage.setItem('testRoute', JSON.stringify(testPost));
            router.push('/follow/999');

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

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold mb-4">따라걷기 테스트</h1>

            {savedRoutes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">저장된 경로가 없습니다.</p>
                </div>
            ) : (
                <ScrollArea className="h-[70vh]">
                    <div className="space-y-4">
                        {savedRoutes.map((route, index) => {
                            const normalizedPath = normalizeCoordinates(route.pathData.path);
                            const distance = calculateRouteDistance(normalizedPath);

                            return (
                                <Card
                                    key={index}
                                    className={`p-4 cursor-pointer transition-colors ${selectedRouteIndex === index
                                        ? 'border-2 border-primary'
                                        : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => setSelectedRouteIndex(index)}
                                >
                                    <div className="mb-4">
                                        <h3 className="font-semibold">
                                            {route.title || `저장된 경로 #${index + 1}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(route.createdAt)}
                                        </p>
                                    </div>

                                    <div className="h-[200px] mb-4">
                                        <ViewingMap
                                            route={{
                                                routeCoordinates: normalizedPath,  // path -> routeCoordinates
                                                pins: route.pathData.pins          // markers -> pins
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
                                                {Math.floor((route.pathData.time || 0) / 60)}분
                                                {(route.pathData.time || 0) % 60}초
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>
            )}

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