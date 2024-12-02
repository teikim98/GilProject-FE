'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostResDTO, getPostsByNickName } from '@/api/post-jg';

interface SubscriberPostListProps {
    nickName: string;
}

const SubscriberPostList: React.FC<SubscriberPostListProps> = ({ nickName }) => {
    const router = useRouter();
    const [posts, setPosts] = useState<PostResDTO[]>([]); // 여기를 빈 배열로 초기화
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPostsByNickName(nickName);
                setPosts(response.content);
            } catch (err) {
                console.error('게시글 목록 조회 실패:', err);
                setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [nickName]);

    if (loading) {
        return <div className="text-center p-4">로딩중...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="p-4">
            {posts?.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.postId} className="hover:bg-gray-50">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium">{post.title}</h4>
                                        <p className="text-sm text-gray-600 mt-2">{post.content}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/posts/${post.nickName}`)}
                                    >
                                        상세보기
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 text-gray-500">
                    작성한 게시글이 없습니다.
                </div>
            )}
        </div>
    );
};

export default SubscriberPostList;