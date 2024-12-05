'use client'

import { Post } from '@/types/types';
import { Heart, MessageCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { ViewingMap } from '../map/ViewingMapProps';
import Link from 'next/link';
import ProfileDialog from '../user/ProfileDialog';
import { useState } from 'react';
import { getPost } from '@/api/post';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useLocationStore } from '@/store/useLocationStore';
import { useSearchStore } from '@/store/useSearchStore';
import { getTimeAgo } from '@/util/dateUtils';

interface BoardCardProps {
    post: Post;
}

export default function BoardCard({ post }: BoardCardProps) {
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
                            <h3 className="font-semibold">{post.nickName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {getTimeAgo(post.writeDate)}
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

