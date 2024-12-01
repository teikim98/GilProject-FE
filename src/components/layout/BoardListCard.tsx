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

interface BoardCardProps {
    post: Post;
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

export default function BoardCard({ post }: BoardCardProps) {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [preventNavigation, setPreventNavigation] = useState(false);

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



    return (
        <Card className="p-4 hover:shadow-lg transition-shadow" onMouseEnter={prefetchPost} // 호버 시 prefetch
        >
            <Link href={`/main/board/${post.postId}`} onClick={handleClick}>
                <div className="flex items-center gap-3 mb-3">
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
                            {formatDate(post.writeDate)}
                        </p>
                        <p>{post.readNum}</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-2">{post.title}</h2>

                {post.pathResDTO && (
                    <div className="h-48 mb-3">
                        <ViewingMap
                            route={{
                                routeCoordinates: post.pathResDTO.routeCoordinates,  // path -> routeCoordinates
                                pins: post.pathResDTO.pins  // markers -> pins
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
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {post.tag}
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </Card>
    );
}