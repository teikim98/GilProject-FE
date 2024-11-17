"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Plus } from 'lucide-react';
import { RouteData } from "@/types/types"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ViewingMap } from "@/components/map/ViewingMapProps";
import BackHeader from "@/components/layout/BackHeader";

export default function PostPage() {
    const [isRouteListOpen, setIsRouteListOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
    const [routes, setRoutes] = useState<RouteData[]>([]);

    useEffect(() => {
        const savedRoutes = localStorage.getItem('savedRoutes');
        if (savedRoutes) {
            setRoutes(JSON.parse(savedRoutes));
        }
    }, []);

    const handleRouteSelect = (route: RouteData) => {
        setSelectedRoute(route);
        setIsRouteListOpen(false);
    };

    return (
        <div className="w-full">
            <BackHeader content={"글 쓰기"} />
            <button
                onClick={() => setIsRouteListOpen(true)}
                className="w-full h-24 border-2 border-dashed rounded-lg hover:bg-accent flex items-center justify-center"
            >
                <Plus className="w-8 h-8" />
            </button>

            <Dialog open={isRouteListOpen} onOpenChange={setIsRouteListOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>저장된 경로 목록</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        {routes.map((route, index) => (
                            <div
                                key={route.createdAt + index}
                                className="p-4 cursor-pointer rounded-lg hover:bg-accent dark:hover:bg-accent/30"
                                onClick={() => handleRouteSelect(route)}
                            >
                                <div className="font-medium">{route.title}</div>
                                <div className="text-sm text-muted-foreground">
                                    {route.createdAt} • {route.pathData.path.length}
                                </div>
                            </div>
                        ))}
                        {routes.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">
                                저장된 경로가 없습니다
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {selectedRoute && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-4">선택된 경로</h2>
                    <Card className="p-4">
                        <h3 className="font-medium">{selectedRoute.title}</h3>
                        <div className="text-sm text-gray-500">
                            <span>{selectedRoute.recordedTime}</span>
                            <span className="mx-2">•</span>
                            <span>{selectedRoute.createdAt}</span>
                        </div>
                        <div className="h-[300px] mt-4">
                            <ViewingMap
                                width="w-full"
                                route={selectedRoute.pathData}
                                height="h-full"
                            />
                        </div>
                    </Card>
                </div>
            )}
            <div className="mt-4">
                <div className="space-y-4">
                    <div className="grid w-full gap-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                            id="title"
                            placeholder="제목을 입력하세요"
                            className="w-full"
                        />
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="content">내용</Label>
                        <Textarea
                            id="content"
                            placeholder="내용을 입력하세요"
                            className="min-h-[200px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
