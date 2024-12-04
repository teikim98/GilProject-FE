'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PostResDTO, getPostsByNickName2 } from '@/api/post-jg';
import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ViewingMap } from '../map/ViewingMapProps';
import { Card } from '@/components/ui/card';
import ProfileDialog from '@/components/user/ProfileDialog';
import { UserSimpleResDTO, getMySubscribes, unsubscribeUser } from '@/api/subscribe';

interface SubscriberPostListProps {
    nickName: string;
}

function PostCard({ post, user }: { post: PostResDTO, user: UserSimpleResDTO }) {
    return (
        <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all">
            {/* 헤더 섹션 */}
            <div className="p-4 pb-2">
                <div className="flex items-center gap-3">
                    <ProfileDialog
                        userId={user.id}
                        className="w-8 h-8"
                    />
                    {/* 사용자 정보 및 제목 */}
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href={`/main/board/${post.postId}`}>
                                <span className="font-medium">{post.nickName || 'pubobo'}</span>
                            </Link>
                            <span className="text-gray-500 text-sm">
                                {new Date(post.writeDate).toLocaleDateString().replace(/202\d\. /, '')}
                            </span>
                        </div>
                        <Link href={`/main/board/${post.postId}`}>
                            <h2 className="font-bold mt-1">{post.title}</h2>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 지도 섹션 */}
            <div className="w-full h-[200px] relative">
                <ViewingMap
                    width='w-full'
                    height='h-full'
                    route={{
                        routeCoordinates: post.pathResDTO?.routeCoordinates?.map(coord => ({
                            latitude: coord.latitude,
                            longitude: coord.longitude,
                        })) || [],
                        pins: post.pathResDTO?.pins?.map(pin => ({
                            id: pin.id,
                            imageUrl: pin.imageUrl || '',
                            content: pin.content || 'No content',
                            latitude: pin.latitude,
                            longitude: pin.longitude,
                        })) || []
                    }}
                />
            </div>

            {/* 푸터 섹션 */}
            <div className="p-4 pt-2 border-t">
                <div className="flex justify-between items-center">
                    {/* 좋아요, 댓글 카운트 */}
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1">
                            <Heart size={16} className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
                            <span className="text-sm text-gray-600">{post.likesCount}</span>
                        </button>
                        <button className="flex items-center gap-1">
                            <MessageCircle size={16} className="text-gray-600" />
                            <span className="text-sm text-gray-600">{post.repliesCount}</span>
                        </button>
                    </div>
                    {/* 거리와 시간 정보 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            {post.pathResDTO?.distance}km
                        </span>
                        <span className="text-sm text-gray-600">
                            {post.pathResDTO?.time}분
                        </span>
                        <Link
                            href={`/main/board/${post.postId}`}
                            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                            산책
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}

const SubscriberPostList: React.FC<SubscriberPostListProps> = ({ nickName }) => {
    const [postsWithUsers, setPostsWithUsers] = useState<{ post: PostResDTO, user: UserSimpleResDTO }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [subscribers, setSubscribers] = useState<UserSimpleResDTO[]>([]);
    const size = 10;

    // 구독자 정보 먼저 가져오기
    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const subscribersList = await getMySubscribes();
                setSubscribers(subscribersList);
            } catch (err) {
                console.error('구독자 목록 불러오기 실패:', err);
                setError('구독자 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchSubscribers();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (subscribers.length === 0) return;

            try {
                setLoading(true);
                const response = await getPostsByNickName2(nickName, page, size);
                const { content, totalElements } = response;

                const newPostsWithUsers = content.map((post: PostResDTO) => {
                    const userInfo = subscribers.find((sub: UserSimpleResDTO) => sub.nickName === post.nickName);
                    return {
                        post,
                        user: userInfo || {
                            id: 0,
                            nickName: post.nickName,
                        }
                    };
                });

                setPostsWithUsers(prev => [...prev, ...newPostsWithUsers]);

                if (postsWithUsers.length + newPostsWithUsers.length >= totalElements) {
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
    }, [nickName, page, subscribers]);

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
            {postsWithUsers.map(({ post, user }) => (
                <PostCard key={post.postId} post={post} user={user} />
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