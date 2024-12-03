'use client';

import React, { useEffect, useState } from 'react';
import { PostResDTO, getPostsByNickName2 } from '@/api/post-jg';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ViewingMap } from '../map/ViewingMapProps';
import { Button } from '@/components/ui/button';



interface SubscriberPostListProps {
    nickName: string;
}



function formatRecordedTime(minutes: number) {
    if (minutes < 60) {
        return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
}

function PostCard({ post }: { post: PostResDTO }) {
    const [isExpanded, setIsExpanded] = useState(false);


    return (
        <div className="">
            <Card
                className={`p-4 transition-all duration-300 ${isExpanded ? 'mb-4' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex cursor-pointer">
                    {/* 축소된 지도 표시 */}
                    <div 
                        onClick={(e) => { e.stopPropagation() }}
                        className={`min-w-32 h-32 mr-4 ${isExpanded ? 'hidden' : ''}`}
                    >
                        <ViewingMap 
                        width='w-full'
                        height='h-full'
                        route={{
                         routeCoordinates: post.pathResDTO?.routeCoordinates?.map(coord => ({
                         latitude: coord.latitude, // 숫자를 문자열로 변환
                        longitude: coord.longitude, // 숫자를 문자열로 변환
                        })) || [],
                        pins: post.pathResDTO?.pins?.map(pin => ({
                            id: pin.id, // id는 숫자 그대로 전달
                            imageUrl: pin.imageUrl || '', // 기본값 제공
                            content: pin.content || 'No content', // 기본값 제공
                            latitude: pin.latitude, // 숫자를 문자열로 변환
                            longitude: pin.longitude, // 숫자를 문자열로 변환
                        })) || []
                        }}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                            <h2 className="font-semibold">{post.title}</h2>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        <p className="text-slate-500 text-sm overflow-hidden line-clamp-3">
                            {post.content}
                        </p>
                        <div className="flex justify-between mt-auto">
                            <span className="text-xs text-gray-400 self-end">
                                {new Date(post.writeDate).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Heart size={18} className={post.isLiked ? 'fill-red-500 text-red-500' : ''} />
                                    <span>{post.likesCount}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <MessageCircle size={18} />
                                    <span>{post.repliesCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              
                 {isExpanded && (
                    <div className="mt-4">
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4"
                        >
                            <ViewingMap
                                width='w-full'
                                height='h-[400px]'
                                route={{
                                    routeCoordinates: post.pathResDTO?.routeCoordinates || [],
                                    pins: post.pathResDTO?.pins || []
                                }}
                            />
                        </div>
                        {/* 경로 정보 표시 */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">총 거리</h3>
                                <p className="font-semibold">
                                    {post.pathResDTO?.distance}km
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-500 p-3 rounded">
                                <h3 className="text-sm text-gray-500 dark:text-white">소요 시간</h3>
                                <p className="font-semibold">
                                    {formatRecordedTime(post.pathResDTO?.time || 0)}
                                </p>
                            </div>
                        </div> 
                        {/* 게시글 내용 및 상세보기 링크 */}
                        <Button variant="outline" size="sm">
                        <Link href={`/main/board/${post.postId}`}>
                        상세보기
                        </Link>
                        </Button>
                    </div>
                )}
            </Card>
            <Separator className="my-4" />
        </div>
    );
}

const SubscriberPostList: React.FC<SubscriberPostListProps> = ({ nickName }) => {
    const [posts, setPosts] = useState<PostResDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const size = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await getPostsByNickName2(nickName, page, size);
                const { content, totalElements } = response;

                setPosts((prev) => [...prev, ...content]);

                if (posts.length + content.length >= totalElements) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error('게시글 목록 불러오기 실패:', err);
                setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [nickName, page]);

    if (loading && posts.length === 0) {
        return <div className="text-center py-8">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (posts.length === 0) {
        return <div className="text-center py-8 text-gray-500">게시글이 없습니다.</div>;
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
            ))}
        </div>
    );
};

export default SubscriberPostList;