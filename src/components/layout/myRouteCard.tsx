'use client'
import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { RouteCardProps, RouteData } from '@/types/types'
import { ViewingMap } from '../map/ViewingMapProps'



function formatRecordedTime(minutes: number) {
    if (minutes < 60) {
        return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
}

function RouteCard({ route }: RouteCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="">
            <Card
                className={`p-4 transition-all duration-300 ${isExpanded ? 'mb-4' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex cursor-pointer">
                    <div onClick={(e) => { e.stopPropagation() }}
                        className={`min-w-32 h-32 mr-4 ${isExpanded ? 'hidden' : ''}`}>
                        <ViewingMap width='w-full'
                            height='h-full'
                            route={
                                {
                                    path: route.pathData.path,
                                    markers: route.pathData.markers
                                }
                            }
                        />

                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                            <h2 className='font-semibold'>{route.title}</h2>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <p className='text-slate-500 text-sm overflow-hidden line-clamp-3'>
                            {route.description}
                        </p>
                        <span className='text-xs text-gray-400 mt-auto'>
                            {new Date(route.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* 확장된 지도 뷰 */}
                {isExpanded && (
                    <div className="mt-4">
                        <div
                            className="mt-4"
                            onClick={(e) => e.stopPropagation()}  // 여기도 동일하게
                        >
                            <ViewingMap width='w-full'
                                height='h-[400px]'
                                route={
                                    {
                                        path: route.pathData.path,
                                        markers: route.pathData.markers
                                    }
                                }
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">총 거리</h3>
                                <p className="font-semibold">
                                    {calculateDistance(route.pathData.path)}km
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm  text-gray-500 dark:text-white">소요 시간</h3>
                                <p className="font-semibold">
                                    {formatRecordedTime(route.recordedTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
            <Separator className='my-4' />
        </div>
    )
}

// 경로 거리 계산 함수
function calculateDistance(path: Array<{ lat: number; lng: number }>): string {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const start = path[i];
        const end = path[i + 1];
        distance += getDistanceFromLatLonInKm(start.lat, start.lng, end.lat, end.lng);
    }
    return distance.toFixed(2);
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export default function MyRouteList() {
    const [routes, setRoutes] = React.useState<RouteData[]>([]);

    React.useEffect(() => {
        const savedRoutes = localStorage.getItem('savedRoutes');
        if (savedRoutes) {
            const parsedRoutes = JSON.parse(savedRoutes);
            setRoutes(parsedRoutes.sort((a: RouteData, b: RouteData) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        }
    }, []);

    if (routes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                저장된 경로가 없습니다.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {routes.map((route, index) => (
                <RouteCard key={route.createdAt + index} route={route} />
            ))}
        </div>
    );
}