"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Plus } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BackHeader from "@/components/layout/BackHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createPost } from "@/api/post";
import { ViewingMap } from "@/components/map/ViewingMapProps";
import { CreatePostRequest } from "@/types/types";

interface SavedRoute {
    title: string;
    description: string;
    pathData: {
        path: Array<{
            lat: number;
            lng: number;
        }>;
        markers: Array<{
            id: string;
            position: {
                lat: number;
                lng: number;
            };
            content: string;
            image?: string;
        }>;
        recordedTime: number;
        distance: number;
    };
    createdAt: string;
}

export default function PostPage() {
    const router = useRouter();
    const [isRouteListOpen, setIsRouteListOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
    const [routes, setRoutes] = useState<SavedRoute[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isWriting, setIsWriting] = useState(false);

    useEffect(() => {
        const savedRoutes = localStorage.getItem('savedRoutes');
        if (savedRoutes) {
            setRoutes(JSON.parse(savedRoutes));
        }
    }, []);

    // 제목이나 내용이 입력되면 작성 중 상태로 변경
    useEffect(() => {
        if (title || content) {
            setIsWriting(true);
        } else {
            setIsWriting(false);
        }
    }, [title, content]);

    const handleRouteSelect = (route: SavedRoute) => {
        setSelectedRoute(route);
        setIsRouteListOpen(false);
    };

    const handleSubmit = async () => {
        if (!selectedRoute || !title.trim()) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }

        try {
            const postData: CreatePostRequest = {
                userNickName: "현재 로그인한 사용자",
                pathId: 1,
                startLat: selectedRoute.pathData.path[0].lat,
                startLong: selectedRoute.pathData.path[0].lng,
                state: 1,
                title: title,
                content: content,
                tag: "산책",
                routeData: {
                    path: selectedRoute.pathData.path,
                    markers: selectedRoute.pathData.markers,
                    recordedTime: selectedRoute.pathData.recordedTime,
                    distance: selectedRoute.pathData.distance
                }
            };

            await createPost(postData);
            router.push('/main/board');
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            alert("게시글 작성에 실패했습니다.");
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <BackHeader
                content="글 쓰기"
                navigationState={isWriting ? 'isWriting' : 'none'}
            />
            <button
                onClick={() => setIsRouteListOpen(true)}
                className="w-full h-24 border-2 border-dashed rounded-lg hover:bg-accent flex items-center justify-center dark:hover:bg-accent/30"
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
                                    {new Date(route.createdAt).toLocaleDateString()} •
                                    거리: {route.pathData.distance}km •
                                    시간: {route.pathData.recordedTime}분
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
                        <div className="text-sm text-muted-foreground">
                            <span>{selectedRoute.pathData.recordedTime}분</span>
                            <span className="mx-2">•</span>
                            <span>{selectedRoute.pathData.distance}km</span>
                        </div>
                        <div className="h-[300px] mt-4">
                            <ViewingMap
                                width="w-full"
                                route={{
                                    path: selectedRoute.pathData.path,
                                    markers: selectedRoute.pathData.markers
                                }}
                                height="h-full"
                            />
                        </div>
                    </Card>
                </div>
            )}

            <div className="mt-4 space-y-4">
                <div className="grid w-full gap-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full"
                    />
                </div>
                <div className="grid w-full gap-2">
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        className="min-h-[200px]"
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={!selectedRoute || !title.trim()}
                    className="w-full mb-16"
                >
                    작성 완료
                </Button>
            </div>
        </div>
    )
}