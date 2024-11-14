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
            <div className="flex gap-4">
                <KakaoMap
                    initialPath={post.routeData.path}
                    initialMarkers={post.routeData.markers}
                    width='w-3/4'
                    height="h-36"
                />
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row justify-between items-end">
                        <h2 className='font-semibold text-lg'>{post.title}</h2>
                        <p className=' text-slate-500 text-xs'>소요시간 <br /> {post.routeData.recordedTime}분 </p>
                    </div>
                    <div className=" flex flex-col text-xs text-slate-500">
                        <div className='flex'>
                            <MapPin size={14} />
                            {post.stats.distanceFromUser}km  {formatDate(post.createdAt)}
                        </div>
                        <div>
                            {post.routeData.startAddress}
                        </div>

                    </div>
                    <div className='flex gap-2'>
                        <Image
                            src={post.author.profileImage}
                            alt={post.author.name}
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                        <h2>{post.author.name}</h2>
                    </div>
                    <div className='flex gap-4 justify-end'>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Heart size={18} />
                            <span>{post.stats.likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <MessageCircle size={18} />
                            <span>{post.stats.commentCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}