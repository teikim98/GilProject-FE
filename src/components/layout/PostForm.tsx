"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Plus, ImagePlus, X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BackHeader from "@/components/layout/BackHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createPost, getPost, updatePost } from "@/api/post";
import { ViewingMap } from "@/components/map/ViewingMapProps";
import { CreatePostRequest, Post, Path } from "@/types/types";
import MyRouteList from "@/components/layout/myRouteCard";

interface WritePostPageProps {
    isEdit?: boolean;
    postId?: number;
}



const INITIAL_POST: Post = {
    postId: 0,
    nickName: "테스트 사용자",
    pathId: 0,
    startLat: 37.5665,
    startLong: 126.978,
    state: 0,
    title: "",
    content: "",
    tag: "산책",
    writeDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    readNum: 0,
    likesCount: 0,
    repliesCount: 0,
    postWishListsNum: 0,
    userImgUrl: "",
    pathResDTO: {
        id: 0,
        user: { id: 0 },
        content: "",
        state: 0,
        title: "",
        time: 0,
        distance: 0,
        startLat: 37.5665,
        startLong: 126.978,
        startAddr: null,
        createdDate: new Date().toISOString(),
        routeCoordinates: [],
        pins: []
    },
    imageUrls: [],
    liked: false,
    wishListed: false
};

export default function PostForm({ isEdit, postId }: WritePostPageProps) {
    const router = useRouter();
    const [isRouteListOpen, setIsRouteListOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState<Path | null>(null);
    const [post, setPost] = useState<Post>(INITIAL_POST);
    const [isWriting, setIsWriting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

    useEffect(() => {
        // 로컬스토리지에서 'savedRoutes' 데이터를 가져오기
        const savedRoutes = JSON.parse(localStorage.getItem("savedRoutes") || "[]");

        // 'savedRoutes'가 비어 있으면 더미 데이터를 추가
        if (!savedRoutes || savedRoutes.length === 0) {
            const dummyData: Path[] = [
                {
                    id: 17,
                    user: {
                        id: 123,
                    },
                    content: "This is a sample path for testing.",
                    state: 1,
                    title: "Default Walking Route",
                    time: 30, // 분 단위
                    createdDate: "2024-11-23T12:00:00Z", // ISO 형식
                    distance: 3.5, // km
                    startLat: 126.978, // 시작점 위도
                    startLong: 37.5665, // 시작점 경도
                    startAddr: "San Francisco, CA", // 시작 주소
                    routeCoordinates: [
                        { latitude: '126.978', longitude: '37.5665' },
                        { latitude: '126.979', longitude: '37.5675' },
                        { latitude: '126.98', longitude: '37.5685' },
                        { latitude: '126.981', longitude: '37.5695' }
                    ],
                    pins: [
                        {
                            id: 1,
                            imageUrl: null,
                            content: "Start Point",
                            latitude: 37.7749,
                            longitude: -122.4194,
                        },
                        {
                            id: 2,
                            imageUrl: "https://example.com/image.png",
                            content: "End Point",
                            latitude: 37.7750,
                            longitude: -122.4180,
                        },
                    ],
                },
            ];

            // 로컬스토리지에 저장
            localStorage.setItem("savedRoutes", JSON.stringify(dummyData));
            console.log("더미 데이터가 저장되었습니다:", dummyData);
        }
    }, []);

    useEffect(() => {
        if (post.title || post.content) {
            setIsWriting(true);
        } else {
            setIsWriting(false);
        }
    }, [post.title, post.content]);

    useEffect(() => {
        if (isEdit && postId) {
            fetchPost();
        }
    }, [isEdit, postId]);

    const fetchPost = async () => {
        if (!postId) return;

        try {
            const data = await getPost(postId);
            setPost(data);
            setSelectedPath(data.pathResDTO);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handlePathSelect = (path: Path) => {
        setSelectedPath(path);
        setPost(prev => ({
            ...prev,
            pathId: path.id,
            pathResDTO: path
        }));
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
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageUrl: string, index: number) => {
        setPost(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
        setDeletedImageUrls(prev => [...prev, imageUrl]);
    };

    const handleSubmit = async () => {
        if (!selectedPath || !post.title.trim()) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();



            if (isEdit && postId) {
                formData.append('postUpdateRequest', JSON.stringify({
                    title: post.title.trim(),
                    content: post.content,
                    tag: post.tag,
                    deleteUrls: deletedImageUrls
                }));
                images.forEach(image => formData.append('images', image));
                await updatePost(postId, formData);
                router.push(`/main/board/${postId}`);
            } else {

                // FormData에 각 필드를 개별적으로 추가
                formData.append("title", post.title.trim());
                formData.append("content", post.content);
                formData.append("tag", post.tag);
                formData.append("pathId", selectedPath.id.toString());  // pathId를 문자열로 전송

                if (images.length > 0) {
                    Array.from(images).forEach((file) => {
                        formData.append("images", file);
                    });
                }
                const response = await createPost(formData);
                router.push('/main/board');
            }
        } catch (error) {
            console.error(isEdit ? "게시글 수정 실패:" : "게시글 작성 실패:", error);
            alert(isEdit ? "게시글 수정에 실패했습니다." : "게시글 작성에 실패했습니다.");
        }
    };

    return (
        <div className="w-full animate-fade-in pb-20">
            <BackHeader
                content={isEdit ? "글 수정" : "글 쓰기"}
                navigationState={isWriting ? 'isWriting' : 'none'}
            />

            {!isEdit && (
                <button
                    onClick={() => setIsRouteListOpen(true)}
                    className="w-full h-24 border-2 border-dashed rounded-lg hover:bg-accent flex items-center justify-center dark:hover:bg-accent/30"
                >
                    <Plus className="w-8 h-8" />
                </button>
            )}

            <Dialog open={isRouteListOpen} onOpenChange={setIsRouteListOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>저장된 경로 목록</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <h3 className="font-semibold mb-4">내 저장 경로</h3>
                        <MyRouteList isWriteMode={true} onRouteSelect={handlePathSelect} />
                    </div>
                </DialogContent>
            </Dialog>

            {selectedPath && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-4">선택된 경로</h2>
                    <Card className="p-4">
                        <h3 className="font-medium">{selectedPath.title}</h3>
                        <div className="text-sm text-muted-foreground">
                            <span>{selectedPath.time}분</span>
                            <span className="mx-2">•</span>
                            <span>{selectedPath.distance}km</span>
                        </div>
                        <div className="h-[300px] mt-4">
                            <ViewingMap
                                width="w-full"
                                route={{
                                    routeCoordinates: selectedPath.routeCoordinates,
                                    pins: selectedPath.pins
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
                        value={post.title}
                        onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="제목을 입력하세요"
                        className="w-full"
                    />
                </div>
                <div className="grid w-full gap-2">
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                        id="content"
                        value={post.content}
                        onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="내용을 입력하세요"
                        className="min-h-[200px]"
                    />
                </div>
                <div className="grid w-full gap-2">
                    <Label htmlFor="tag">태그 (5자 이내)</Label>
                    <Input
                        id="tag"
                        value={post.tag}
                        maxLength={5}
                        onChange={(e) => setPost(prev => ({
                            ...prev,
                            tag: e.target.value.slice(0, 5)
                        }))}
                        placeholder="태그를 입력하세요"
                        className="w-full"
                    />
                    {post.tag.length > 0 && (
                        <p className="text-sm text-muted-foreground text-right">
                            {post.tag.length}/5
                        </p>
                    )}
                </div>

                <div className="grid w-full gap-2 pt-4">
                    <Label>이미지</Label>
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

                        {/* 기존 이미지 표시 */}
                        {isEdit && post.imageUrls.map((imageUrl, index) => (
                            <div key={`existing-${index}`} className="relative w-24 h-24">
                                <img
                                    src={imageUrl}
                                    alt={`existing ${index}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removeExistingImage(imageUrl, index)}
                                    className="absolute -top-2 -right-2 p-1 bg-background border rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* 새로 추가된 이미지 미리보기 */}
                        {previews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative w-24 h-24">
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
                    disabled={!selectedPath || !post.title.trim()}
                    className="w-full mb-16"
                >
                    {isEdit ? "수정 완료" : "작성 완료"}
                </Button>
            </div>
        </div>
    );
}