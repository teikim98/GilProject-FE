'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/types/types'
import { Card } from '@/components/ui/card';
import { ViewingMap } from '@/components/map/ViewingMapProps';
import { Button } from '@/components/ui/button';
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle, Navigation } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import BackHeader from '@/components/layout/BackHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPost } from '@/api/post';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"

interface PostPageProps {
    params: {
        id: string;
    };
}

export default function PostPage({ params }: PostPageProps) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPost(parseInt(params.id))
                setPost(data)
                // 지도 + 이미지 개수로 count 설정
                setCount(1 + (data.images?.length || 0))
            } catch (err) {
                setError('게시글을 불러오는데 실패했습니다.')
                console.error('Error fetching post:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [])

    useEffect(() => {
        if (!api) {
            return
        }

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>{error}</div>
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
        <div className="animate-fade-in flex flex-col min-h-screen pb-16">
            <BackHeader content={post.title} />

            <div className="relative mb-4">
                <Carousel
                    setApi={setApi}
                    className="w-full"
                    opts={{
                        dragFree: false,
                        containScroll: "trimSnaps",
                        watchDrag: false  // 드래그 비활성화
                    }}
                >
                    <CarouselContent>
                        {/* 지도 슬라이드 */}
                        {post.routeData && (
                            <CarouselItem>
                                <div className="h-[300px]">
                                    <ViewingMap
                                        route={{
                                            path: post.routeData.path,
                                            markers: post.routeData.markers
                                        }}
                                        width="w-full"
                                        height="h-full"
                                    />
                                </div>
                            </CarouselItem>
                        )}

                        {/* 이미지 슬라이드들 */}
                        {post.images?.map((image, index) => (
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

                    {/* 이미지가 있을 때만 네비게이션 버튼 표시 */}
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

                    {/* 슬라이드 인디케이터 */}
                    {count > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {Array.from({ length: count }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${current === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </Carousel>
            </div>

            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userNickName}`} />
                    <AvatarFallback>{post.userNickName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{post.userNickName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.writeDate)}
                    </p>
                </div>
            </div>

            {/* 경로 정보 */}
            {post.routeData && (
                <Card className="p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">총 거리</p>
                            <p className="font-semibold">{post.routeData.distance}km</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">소요 시간</p>
                            <p className="font-semibold">{post.routeData.recordedTime}분</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* 본문 내용 */}
            <Card className="p-4 mb-4">
                <div className="space-y-2">
                    <div className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                        {post.tag}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>
            </Card>

            {/* 상호작용 버튼 */}
            <Card className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Heart className={`w-5 h-5 ${post.postLikesNum > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{post.postLikesNum}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.repliesNum}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Bookmark className={`w-5 h-5 ${post.postWishListsNum > 0 ? 'fill-current' : ''}`} />
                            <span>{post.postWishListsNum}</span>
                        </Button>
                    </div>
                    {/* 수정하기 버튼 추가 */}
                    <Link href={`/main/board/${params.id}/edit`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            수정하기
                        </Button>
                    </Link>
                </div>
            </Card>


            <Link href={`/follow/${params.id}`}>
                <Button
                    className="w-full mb-4 bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                >
                    <Navigation className="w-5 h-5 mr-2" />
                    이 경로 따라걷기
                </Button>
            </Link>

            <Separator className="my-4" />

            <div className="space-y-4">
                <h3 className="font-semibold">댓글 {post.repliesNum}개</h3>
                {/* 댓글 목록 컴포넌트 */}
            </div>
        </div>
    )
}