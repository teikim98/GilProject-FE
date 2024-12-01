'use client';

import React, { useEffect, useState } from 'react';
import { Post, GetUserPostsResponse } from '@/types/types';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deletePost } from '@/api/post';
import { getUserPostWishlist } from '@/api/user';
import { toast } from '@/hooks/use-toast';

const MyPostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const size = 10;
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response: GetUserPostsResponse = await getUserPostWishlist(page, size);
                console.log("API 응답 데이터 구조:", response);

                const { content, totalElements } = response;
                console.log('content:', content);
                console.log('totalElements:', totalElements);

                if (!content || !Array.isArray(content)) {
                    console.error('잘못된 응답 데이터 구조:', response);
                    throw new Error('잘못된 응답 형식');
                }

                setPosts((prev) => [...prev, ...content]);

                if (posts.length + content.length >= totalElements) {
                    setHasMore(false);
                }
            } catch (err: any) {
                console.error('게시글 목록 불러오기 실패:', err);
                setError('게시글을 불러오는 데 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const handleDelete = async (postId: number) => {
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((post) => post.postId !== postId));
            toast({ description: '게시글이 삭제되었습니다.' });
        } catch (err) {
            console.error('게시글 삭제 실패:', err);
            toast({
                description: '게시글 삭제에 실패했습니다.',
                variant: 'destructive',
            });
        }
    };

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
                <Card key={post.postId} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <Link href={`/main/board/${post.postId}`}>
                                <h2 className="text-xl font-bold hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-sm text-gray-500">
                                {post.nickName} • {new Date(post.writeDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>취소</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(post.postId);
                                            }}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            삭제
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <Link href={`/main/board/${post.postId}`}>
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-3 hover:text-blue-600 transition-colors">
                            {post.content}
                        </p>
                    </Link>

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Heart size={18} className={post.liked ? 'fill-red-500 text-red-500' : ''} />
                                <span>{post.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <MessageCircle size={18} />
                                <span>{post.repliesCount}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            {posts.length > 0 && !loading && hasMore && (
                <div className="text-center mt-4">
                    <Button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        더 보기
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MyPostList;