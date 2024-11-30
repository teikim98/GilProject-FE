// components/MyPostList.tsx

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
import { getUserPosts } from '@/api/user';
import { toast } from '@/hooks/use-toast';

const MyPostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]); // 게시글 목록
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const [page, setPage] = useState(0); // 페이지 번호
    const size = 10; // 한 페이지에 가져올 게시글 수
    const [hasMore, setHasMore] = useState(true); // 더 불러올 게시글 여부

    // 게시글 목록 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null); // 에러 초기화
                const response: GetUserPostsResponse = await getUserPosts(page, size); // API 호출
                console.log("API 응답 데이터 구조:", response);


                // 응답 데이터 검증
                const { content, totalElements } = response;
                console.log('content:', content);
                console.log('totalElements:', totalElements);

                if (!content || !Array.isArray(content)) {
                    console.error('잘못된 응답 데이터 구조:', response);
                    throw new Error('잘못된 응답 형식');
                }

                setPosts((prev) => [...prev, ...content]); // 기존 게시물에 추가

                // 더 이상 불러올 데이터가 없으면 hasMore 업데이트
                if (posts.length + content.length >= totalElements) {
                    setHasMore(false);
                }
            } catch (err: any) {
                console.error('게시글 목록 불러오기 실패:', err);
                if (err.response) {
                    console.error('HTTP 상태 코드:', err.response.status);
                    console.error('응답 헤더:', err.response.headers);
                    console.error('응답 데이터:', err.response.data);
                } else if (err.request) {
                    console.error('요청이 전송되었으나 응답이 없음:', err.request);
                } else {
                    console.error('요청 설정 중 문제가 발생:', err.message);
                }
                setError('게시글을 불러오는 데 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    // 게시글 삭제 처리
    const handleDelete = async (postId: number) => {
        try {
            await deletePost(postId); // 삭제 API 호출
            setPosts((prev) => prev.filter((post) => post.postId !== postId)); // 삭제된 게시글 제거
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



// 'use client';

// import React, { useEffect } from 'react';
// import {getPostsByKeyword, getPostNear } from '@/api/post';
// import {getUserPosts} from '@/api/user'

// const MyPostList: React.FC = () => {
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 // 기존 getUserPosts 호출
//                 const userPostsResponse = await getUserPosts(0, 10); // page=0, size=10
//                 console.log("getUserPosts API 응답 데이터 구조:", userPostsResponse);

//                 // 추가: getPostsByKeyword 호출
//                 // const keyword = '산책';
//                 // const keywordResponse = await getPostsByKeyword(keyword, 0, 10);
//                 // console.log("getPostsByKeyword API 응답 데이터 구조:", keywordResponse);

//                 // 추가: getPostNear 호출
//                 // const latitude = 37.5665;
//                 // const longitude = 126.978;
//                 // const nearbyPostsResponse = await getPostNear(latitude, longitude, 0, 10);
//                 // console.log("getPostNear API 응답 데이터 구조:", nearbyPostsResponse);
//             } catch (err) {
//                 console.error('API 호출 실패:', err);
//             }
//         };

//         fetchPosts();
//     }, []);

//     return <div>API 호출 테스트</div>;
// };

// export default MyPostList;