'use client'
import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Path } from '@/types/types'
import { ViewingMap } from '../map/ViewingMapProps'
import { Button } from '../ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';
import { deletePath, getAllUserPaths } from '@/api/route'
import { toast } from '@/hooks/use-toast'

interface MyRouteCardProps {
    route: Path;
    isWriteMode?: boolean;
    onSelect?: (route: Path) => void;
    onDelete?: (routeId: number) => void;
}

function formatRecordedTime(minutes: number) {
    if (minutes < 60) {
        return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
}

function RouteCard({
    route,
    isWriteMode = false,
    onSelect,
    onDelete
}: MyRouteCardProps & { onDelete?: (routeId: number) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSelectRoute = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(route);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(route.id);
    };

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
                            route={{
                                routeCoordinates: route.routeCoordinates,
                                pins: route.pins
                            }}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                            <h2 className='font-semibold'>{route.title}</h2>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <p className='text-slate-500 text-sm overflow-hidden line-clamp-3'>
                            {route.content}
                        </p>
                        <div className='flex justify-between mt-auto'>
                            <span className='text-xs text-gray-400 self-end'>
                                {new Date(route.createDate).toLocaleDateString()}
                            </span>
                            <div className="flex self-end gap-2">
                                {!isWriteMode && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive/90"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>경로 삭제</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    정말로 이 경로를 삭제하시겠습니까?
                                                    삭제된 경로는 복구할 수 없습니다.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                                                    취소
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(e);
                                                    }}
                                                    className="bg-destructive hover:bg-destructive/90"
                                                >
                                                    삭제
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                            {isWriteMode && (
                                <Button
                                    className='w-[50%] self-end'
                                    onClick={handleSelectRoute}
                                >
                                    선택하기
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 확장된 지도 뷰 */}
                {isExpanded && (
                    <div className="mt-4">
                        <div
                            className="mt-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ViewingMap
                                width='w-full'
                                height='h-[400px]'
                                route={{
                                    routeCoordinates: route.routeCoordinates,  // path -> routeCoordinates
                                    pins: route.pins  // markers -> pins
                                }}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">총 거리</h3>
                                <p className="font-semibold">
                                    {route.distance}km
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">소요 시간</h3>
                                <p className="font-semibold">
                                    {formatRecordedTime(route.time)}
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


export default function MyRouteList({
    isWriteMode = false,
    onRouteSelect
}: {
    isWriteMode?: boolean;
    onRouteSelect?: (route: Path) => void
}) {
    const [routes, setRoutes] = useState<Path[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            // if (!user) {
            //     setError('로그인이 필요합니다.');
            //     setLoading(false);
            //     return;
            // }

            try {
                setLoading(true);
                const data = await getAllUserPaths();
                console.log('Fetched routes:', data); // 받아온 데이터 확인

                // 좌표 데이터 변환 및 유효성 검사
                const processedRoutes = data.map(route => ({
                    ...route,
                    routeCoordinates: route.routeCoordinates.map(coord => ({
                        // 좌표값 순서 교정
                        latitude: coord.latitude, // 백엔드에서 반대로 온 값 교정
                        longitude: coord.longitude  // 백엔드에서 반대로 온 값 교정
                    }))
                }));

                console.log('Processed routes:', processedRoutes); // 처리된 데이터 확인
                setRoutes(processedRoutes);
            } catch (err) {
                console.error('Error fetching routes:', err);
                setError('경로를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const handleDelete = async (routeId: number) => {
        try {
            await deletePath(routeId);
            setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
            toast({
                description: "경로가 삭제되었습니다."
            });
        } catch (err) {
            toast({
                description: "경로 삭제에 실패했습니다.",
                variant: "destructive"
            });
        }
    };

    // if (!user) {
    //     return <div className="text-center py-8 text-gray-500">로그인이 필요합니다.</div>;
    // }

    if (loading) {
        return <div className="text-center py-8">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (routes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                저장된 경로가 없습니다.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {routes.map((route) => (
                <RouteCard
                    key={route.id}
                    route={route}
                    isWriteMode={isWriteMode}
                    onSelect={onRouteSelect}
                    onDelete={!isWriteMode ? handleDelete : undefined}
                />
            ))}
        </div>
    );
}