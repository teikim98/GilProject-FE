'use client'
import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { RouteCardProps, RouteData } from '@/types/types'
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
}: RouteCardProps & { onDelete?: (routeId: string) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSelectRoute = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(route);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(route.createdAt);
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
                        <div className='flex justify-between mt-auto'>
                            <span className='text-xs text-gray-400 self-end'>
                                {new Date(route.createdAt).toLocaleDateString()}
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
                                    path: route.pathData.path,
                                    markers: route.pathData.markers
                                }}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">총 거리</h3>
                                <p className="font-semibold">
                                    {route.pathData.distance}km
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">소요 시간</h3>
                                <p className="font-semibold">
                                    {formatRecordedTime(route.pathData.recordedTime)}
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
    onRouteSelect?: (route: RouteData) => void
}) {
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

    const handleDelete = (routeId: string) => {
        const updatedRoutes = routes.filter(route => route.createdAt !== routeId);
        setRoutes(updatedRoutes);
        localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));
    };

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
                <RouteCard
                    key={route.createdAt + index}
                    route={route}
                    isWriteMode={isWriteMode}
                    onSelect={onRouteSelect}
                    onDelete={!isWriteMode ? handleDelete : undefined}
                />
            ))}
        </div>
    );
}