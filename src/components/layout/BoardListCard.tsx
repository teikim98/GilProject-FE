// components/BoardCard.tsx
'use client'

import { Post } from '@/types/types';
import Image from 'next/image';
import KakaoMap from '@/app/providers/KakaoMap';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { Card } from '../ui/card';

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
    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <Image
                    src={post.author.profileImage}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-2">{post.title}</h2>

            <div className="h-48 mb-3">
                <KakaoMap
                    initialPath={post.routeData.path}
                    initialMarkers={post.routeData.markers}
                    height="h-full"
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Heart size={18} />
                        <span>{post.stats.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <MessageCircle size={18} />
                        <span>{post.stats.commentCount}</span>
                    </div>
                </div>

                <div className="flex gap-3 text-sm text-gray-500">
                    <span>{post.routeData.distance}km</span>
                    <span>{post.routeData.recordedTime}분</span>
                    {post.stats.distanceFromUser !== undefined && (
                        <span>현재 위치에서 {post.stats.distanceFromUser}km</span>
                    )}
                </div>
            </div>

            <div className="mt-2 text-sm text-gray-500">
                {post.routeData.startAddress}
            </div>
        </Card>
    );
}