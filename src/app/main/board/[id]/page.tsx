'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/types/types'
import { Card } from '@/components/ui/card';
import { ViewingMap } from '@/components/map/ViewingMapProps';
import { Button } from '@/components/ui/button';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import BackHeader from '@/components/layout/BackHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPost } from '@/api/post';


interface PostPageProps {
    params: {
        id: string;
    };
}

export default function PostPage({ params }: PostPageProps) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPost(parseInt(params.id))
                setPost(data)
            } catch (err) {
                setError('게시글을 불러오는데 실패했습니다.')
                console.error('Error fetching post:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [])

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
            <BackHeader
                content={post.title}
            />

            {post.routeData && (
                <Card className="mb-4">
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
                    <div className="p-4 grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800">
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
                </div>
            </Card>

            <Button> 따라걷기 </Button>

            <Separator className="my-4" />


            <div className="space-y-4">
                <h3 className="font-semibold">댓글 {post.repliesNum}개</h3>
                {/* 댓글 목록 컴포넌트 */}
            </div>
        </div>
    )
}