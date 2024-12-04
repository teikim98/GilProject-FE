'use client'
import { useEffect, useState } from 'react'
import { usePostDetailQuery, usePostMutations } from '@/hooks/queries/usePostQuery';
import { Card } from '@/components/ui/card';
import { ViewingMap } from '@/components/map/ViewingMapProps';
import { Button } from '@/components/ui/button';
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle, Navigation } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import BackHeader from '@/components/layout/BackHeader';
import { getPost, togglePostLike, deletePost, togglePostWishlist } from '@/api/post';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { CommentSection } from '@/components/comment/CommentSection';
import { Post } from '@/types/types';
import { toast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog"
import ProfileDialog from '@/components/user/ProfileDialog';
import { jwtDecode } from "jwt-decode";
import { useLocationStore } from '@/store/useLocationStore';


interface PostPageProps {
    params: {
        id: string;
    };
}

interface JWTPayload {
    id: number;
}

export default function PostPage({ params }: PostPageProps) {
    const postId = parseInt(params.id);
    const router = useRouter();
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [userId, setUserId] = useState<number | null>(null);
    const setSelectedLocation = useLocationStore(state => state.setSelectedLocation);

    const {
        data: post,
        isLoading,
        isError
    } = usePostDetailQuery(postId);

    const { like, wishlist, remove } = usePostMutations(postId);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            const decoded = jwtDecode<JWTPayload>(token);
            setUserId(decoded.id);
        }
    }, []);


    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        });
    }, [api]);

    useEffect(() => {
        if (post) {
            setCount(1 + (post.imageUrls?.length || 0));
        }
    }, [post]);

    const handleTagClick = (tag: string) => {
        setSelectedLocation('검색결과');

        router.push(`/main/board?tag=${encodeURIComponent(tag)}`);
    };

    const handleLikeToggle = async () => {
        try {
            await like();
            toast({
                description: post?.liked ? "좋아요를 취소했습니다." : "좋아요를 눌렀습니다."
            });
        } catch {
            toast({
                description: "좋아요 처리에 실패했습니다."
            });
        }
    };

    const handleWishlistToggle = async () => {
        try {
            await wishlist();
            toast({
                description: post?.wishListed ? "찜 목록에서 제거되었습니다." : "찜 목록에 추가되었습니다."
            });
        } catch {
            toast({
                description: "찜하기 처리에 실패했습니다."
            });
        }
    };

    const handleDelete = async () => {
        try {
            await remove();
            toast({
                description: "게시글이 삭제되었습니다."
            });
            router.push('/main/board');
        } catch {
            toast({
                description: "게시글 삭제에 실패했습니다."
            });
        }
    };

    if (isLoading) return <div>로딩 중...</div>
    if (isError) return <div>게시글을 불러오는데 실패했습니다.</div>
    if (!post) return <div>게시글을 찾을 수 없습니다.</div>

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="animate-fade-in flex flex-col min-h-screen pb-20">
            <BackHeader content={post.title} />
            <div className="relative mb-4">
                <Carousel
                    setApi={setApi}
                    className="w-full"
                    opts={{
                        dragFree: false,
                        containScroll: "trimSnaps",
                        watchDrag: false
                    }}
                >
                    <CarouselContent>
                        {post.pathResDTO && (
                            <CarouselItem>
                                <div className="h-[300px]">
                                    <ViewingMap
                                        route={{
                                            routeCoordinates: post.pathResDTO.routeCoordinates,
                                            pins: post.pathResDTO.pins
                                        }}
                                        width="w-full"
                                        height="h-full"
                                    />
                                </div>
                            </CarouselItem>
                        )}

                        {post.imageUrls?.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="h-[300px]">
                                    <img
                                        src={image}
                                        alt={`게시글 이미지 ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {count > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                                onClick={() => api?.scrollPrev()}
                                disabled={current === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                                onClick={() => api?.scrollNext()}
                                disabled={current === count - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {count > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {Array.from({ length: count }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${current === index ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                                />
                            ))}
                        </div>
                    )}
                </Carousel>
            </div>
            <div className="flex items-center gap-3 mb-4">
                <ProfileDialog userId={post.postUserId} />
                <div>
                    <p className="font-semibold">{post.nickName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.writeDate)}
                    </p>
                </div>
            </div>

            {post.pathResDTO && (
                <Card className="p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">총 거리</p>
                            <p className="font-semibold">{post.pathResDTO.distance}km</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">소요 시간</p>
                            <p className="font-semibold">{post.pathResDTO.time}분</p>
                        </div>
                    </div>
                </Card>
            )}

            <Card className="p-4 mb-4">
                <div className="space-y-2">
                    <button
                        onClick={() => handleTagClick(post.tag)}
                        className="inline-block px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                        {post.tag}
                    </button>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleLikeToggle}
                        >
                            <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{post.likesCount}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.repliesCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleWishlistToggle}
                        >
                            <Bookmark className={`w-5 h-5 ${post.wishListed ? 'fill-current' : ''}`} />
                            <span>{post.postWishListsNum}</span>
                        </Button>
                    </div>

                    {post.postUserId === userId && (
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Link href={`/main/board/${params.id}/edit`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    수정하기
                                </Button>
                            </Link>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1 text-red-500 hover:text-red-600"
                                    >
                                        삭제하기
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            정말로 이 게시글을 삭제하시겠습니까?
                                            삭제된 게시글은 복구할 수 없습니다.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>취소</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            삭제
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </Card>

            <Link href={`/follow/${post.pathId}`}>
                <Button
                    className="w-full my-4 bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                >
                    <Navigation className="w-5 h-5 mr-2" />
                    이 경로 따라걷기
                </Button>
            </Link>

            <Separator className="my-4" />
            <div className="space-y-4">
                <h3 className="font-semibold">댓글 {post.repliesCount}개</h3>
                <CommentSection postId={parseInt(params.id)} />
            </div>
        </div>
    )
}