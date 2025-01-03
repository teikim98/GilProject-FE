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
import { processPostImages } from "@/util/imageUtils";
import { useQueryClient } from "@tanstack/react-query";

interface WritePostPageProps {
    isEdit?: boolean;
    postId?: number;
}



const INITIAL_POST: Post = {
    postId: 0,
    postUserId: 1,
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
        createDate: new Date().toISOString(),
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
    const queryClient = useQueryClient();

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const { validFiles, errorMessage } = await processPostImages(files);

        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        if (validFiles.length > 0) {
            setImages(prev => [...prev, ...validFiles]);

            // 미리보기용 URL 생성
            validFiles.forEach(file => {
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
                // postUpdateRequest를 백엔드 DTO 구조에 맞게 수정
                const postPatchRequestDTO = {
                    title: post.title.trim(),
                    content: post.content,
                    tag: post.tag,
                    deleteUrls: deletedImageUrls
                };

                // JSON 문자열로 변환하지 않고 개별 필드로 전송
                formData.append('title', postPatchRequestDTO.title);
                formData.append('content', postPatchRequestDTO.content);
                formData.append('tag', postPatchRequestDTO.tag);

                // deleteUrls를 개별적으로 추가
                deletedImageUrls.forEach(url => {
                    formData.append('deleteUrls', url);
                });

                // 새 이미지들을 newImages로 추가
                images.forEach(image => {
                    formData.append('newImages', image);
                });



                await updatePost(postId, formData);

                await queryClient.invalidateQueries({ queryKey: ['post', postId] });
                await queryClient.invalidateQueries({ queryKey: ['posts'] });

                router.push(`/main/board/${postId}`);
            } else {
                // 새 게시글 생성 로직은 그대로 유지
                formData.append("title", post.title.trim());
                formData.append("content", post.content);
                formData.append("tag", post.tag);
                formData.append("pathId", selectedPath.id.toString());

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