"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Plus, ImagePlus, X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import BackHeader from "@/components/layout/BackHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createPost } from "@/api/post";
import { ViewingMap } from "@/components/map/ViewingMapProps";
import { CreatePostRequest } from "@/types/types";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import MyRouteList from "@/components/layout/myRouteCard";

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
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const savedRoutes = localStorage.getItem('savedRoutes');
        if (!savedRoutes) {
            const testRoute: SavedRoute = {
                title: "테스트 산책로",
                description: "테스트용 산책 경로입니다",
                pathData: {
                    path: [
                        { lat: 37.5665, lng: 126.9780 },  // 서울시청 좌표
                        { lat: 37.5668, lng: 126.9785 },
                        { lat: 37.5671, lng: 126.9790 }
                    ],
                    markers: [
                        {
                            id: "1",
                            position: { lat: 37.5665, lng: 126.9780 },
                            content: "시작점",
                        }
                    ],
                    recordedTime: 30,
                    distance: 2.5
                },
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('savedRoutes', JSON.stringify([testRoute]));
            setRoutes([testRoute]);
        } else {
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



    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImages(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                    // 에디터에 이미지 삽입
                    const imageUrl = reader.result as string;
                    setContent(prev => prev + `<img src="${imageUrl}" alt="uploaded image" />`);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        // 기존 이미지 배열에서 제거
        setImages(prev => prev.filter((_, i) => i !== index));

        // 미리보기 URL 가져오기
        const imageUrlToRemove = previews[index];
        setPreviews(prev => prev.filter((_, i) => i !== index));

        // DOM parser를 사용하여 에디터 내용에서 이미지 제거
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const images = tempDiv.getElementsByTagName('img');

        // HTMLCollection을 배열로 변환하여 역순으로 순회
        Array.from(images).reverse().forEach(img => {
            if (img.src === imageUrlToRemove) {
                img.remove();
            }
        });

        setContent(tempDiv.innerHTML);
    };

    const handleSubmit = async () => {
        if (!selectedRoute || !title.trim()) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();

            const postData: CreatePostRequest = {
                title: title.trim(),
                content: content,
                tag: "산책",
                routeData: {
                    path: selectedRoute.pathData.path,
                    markers: selectedRoute.pathData.markers,
                    recordedTime: selectedRoute.pathData.recordedTime,
                    distance: selectedRoute.pathData.distance
                }
            };

            formData.append('postData', JSON.stringify(postData));

            images.forEach((image) => {
                formData.append('images', image);
            });

            await createPost(formData);
            router.push('/main/board');
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            alert("게시글 작성에 실패했습니다.");
        }
    };

    return (
        <div className="w-full animate-fade-in pb-20">
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
                        {/* {routes.map((route, index) => (
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
                        ))} */}
                        <div className="mt-4">
                            <h3 className="font-semibold mb-4">내 저장 경로</h3>
                            <MyRouteList isWriteMode={true} onRouteSelect={handleRouteSelect} />
                        </div>
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
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        className="h-[300px] mb-12"
                        theme="snow"
                    />
                </div>
                <div className="grid w-full gap-2 pt-4">
                    <div className="flex flex-wrap gap-2">
                        <label className="w-24 h-24 border-2 border-dashed rounded-lg hover:bg-accent flex items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <ImagePlus className="w-6 h-6" />
                        </label>

                        {/* 이미지 미리보기 */}
                        {previews.map((preview, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img
                                    src={preview}
                                    alt={`preview ${index}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 p-1 bg-background border rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
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