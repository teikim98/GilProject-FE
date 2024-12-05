'use client';

import React, { useEffect, useState } from 'react';
import { getPostsByNickName } from '@/api/post';
import { PostResDTO } from '@/types/types_JG';
import { Heart, MessageCircle } from 'lucide-react';
import { ViewingMap } from '../map/ViewingMapProps';
import { Card } from '@/components/ui/card';
import ProfileDialog from '@/components/user/ProfileDialog';
import { UserSimpleResDTO, getMySubscribes } from '@/api/subscribe';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { useLocationStore } from '@/store/useLocationStore';
import { useSearchStore } from '@/store/useSearchStore';
import { getPost } from '@/api/post';

interface SubscriberPostListProps {
    nickName: string;
}

interface BoardCardProps {
    post: PostResDTO | Post; // 둘 다 허용
}

function formatDate(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else {
        return `${diffDays}일 전`;
    }
}

function BoardCard({ post }: BoardCardProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [preventNavigation, setPreventNavigation] = useState(false);
    const setSelectedLocation = useLocationStore(state => state.setSelectedLocation);
    const setQuery = useSearchStore(state => state.setQuery);

    // 마우스 호버 시 데이터 미리 불러오기
    const prefetchPost = () => {
        queryClient.prefetchQuery({
            queryKey: ['post', post.postId],
            queryFn: () => getPost(post.postId),
            staleTime: 1000 * 60 * 5 // 5분간 캐시 유지
        });
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDialogOpen || preventNavigation) {
            e.preventDefault();
            e.stopPropagation();

            if (preventNavigation) {
                setTimeout(() => {
                    setPreventNavigation(false);
                }, 100);
            }
        }
    };

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedLocation('검색결과');
        setQuery('');
        router.push(`/main/board?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow" onMouseEnter={prefetchPost}>
            <Link href={`/main/board/${post.postId}`} onClick={handleClick}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className='flex gap-3'>
                        <ProfileDialog
                            userId={post.postUserId}
                            onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setPreventNavigation(true);
                                }
                            }}
                        />

                        <div>
                            <h3 className="font-medium">{post.nickName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(post.writeDate)}
                            </p>
                        </div>
                    </div>

                    <p className='text-sm text-gray-500 dark:text-gray-400'>조회수 {post.readNum}</p>
                </div>

                <h2 className="text-xl font-bold mb-2">{post.title}</h2>

                {post.pathResDTO && (
                    <div className="h-48 mb-3">
                        <ViewingMap
                            route={{
                                routeCoordinates: post.pathResDTO.routeCoordinates,
                                pins: post.pathResDTO.pins
                            }}
                            width="w-full"
                            height="h-full"
                        />
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Heart size={18} className={post.liked === true ? 'fill-red-500 text-red-500' : ''} />
                            <span>{post.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MessageCircle size={18} />
                            <span>{post.repliesCount}</span>
                        </div>
                    </div>

                    {post.pathResDTO && (
                        <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span>{post.pathResDTO.distance}km</span>
                            <span>{post.pathResDTO.time}분</span>
                            <button
                                onClick={(e) => handleTagClick(e, post.tag)}
                                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {post.tag}
                            </button>
                        </div>
                    )}
                </div>
            </Link>
        </Card>
    );
}

const SubscriberPostList: React.FC<SubscriberPostListProps> = ({ nickName }) => {
    const [postsWithUsers, setPostsWithUsers] = useState<{ post: PostResDTO, user: UserSimpleResDTO }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const size = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const subscribersList = await getMySubscribes();
                const response = await getPostsByNickName(nickName, page, size);

                if (!response?.content) return;

                const newPostsWithUsers = response.content.map((post: PostResDTO) => {
                    const userInfo = subscribersList.find(sub => sub.nickName === post.nickName);
                    return {
                        post,
                        user: {
                            id: userInfo ? userInfo.id : 0,  // 삼항 연산자로 변경
                            nickName: post.nickName
                        }
                    };
                });

                setPostsWithUsers(prev => [...prev, ...newPostsWithUsers]);
                if (response.totalElements <= postsWithUsers.length + newPostsWithUsers.length) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [nickName, page]);

    if (loading && postsWithUsers.length === 0) {
        return <div className="text-center py-8">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (postsWithUsers.length === 0) {
        return <div className="text-center py-8 text-gray-500">게시글이 없습니다.</div>;
    }

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            {postsWithUsers.map(({ post, user }, index) => (
                <BoardCard key={`${post.postId}-${index}`} post={post} />
            ))}
            {hasMore && (
                <div className="text-center py-4">
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
};



export default SubscriberPostList;