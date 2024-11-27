// CommentSection.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment, toggleCommentLike } from "@/api/comment";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CommentSectionProps {
    postId: number;
}

// ReplyDTO 타입 정의
interface Reply {
    replyId: number;      // id → replyId
    content: string;
    replyDate: string;    // writeDate → replyDate
    nickName: string;
    likesCount: number;
    isLiked: boolean;     // liked → isLiked
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Reply[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getTimeAgo = (isoDate: string): string => {
        const now = new Date();
        const past = new Date(isoDate);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        // 1분 미만
        if (diffInSeconds < 60) {
            return '방금 전';
        }
        // 1시간 미만
        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`;
        }
        // 24시간 미만
        if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        }
        // 7일 미만
        if (diffInDays < 7) {
            return `${diffInDays}일 전`;
        }
        // 7일 이상
        return past.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    // 댓글 목록 조회
    const fetchComments = async () => {
        try {
            const data = await getComments(postId);
            console.log(data)
            setComments(data);
        } catch (error) {
            toast({
                title: "에러",
                description: "댓글을 불러오는데 실패했습니다.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // 댓글 작성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            await createComment(postId, newComment);
            await fetchComments(); // 댓글 목록 새로고침
            setNewComment("");
            toast({
                description: "댓글이 작성되었습니다.",
            });
        } catch (error) {
            toast({
                title: "에러",
                description: "댓글 작성에 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 댓글 삭제
    const handleDelete = async (replyId: number) => {
        if (!replyId) {
            console.error("Reply ID is missing");
            return;
        }
        try {
            await deleteComment(postId, replyId);
            await fetchComments();
            toast({
                description: "댓글이 삭제되었습니다."
            });
        } catch (error) {
            toast({
                description: "댓글 삭제에 실패했습니다."
            });
        }
    };

    //좋아요 토글
    const handleLikeToggle = async (replyId: number) => {
        if (!replyId) {
            console.error("Reply ID is missing");
            return;
        }
        try {
            await toggleCommentLike(postId, replyId);
            await fetchComments();
        } catch (error) {
            toast({
                description: "좋아요 처리에 실패했습니다."
            });
        }
    };

    return (
        <div className="space-y-4 mb-16">
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment.replyId} className="flex gap-3 py-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.nickName}`} />
                            <AvatarFallback>{comment.nickName}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{comment.nickName}</span>
                                <span className="text-sm text-gray-500">
                                    {getTimeAgo(comment.replyDate)}

                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300">
                                {comment.content}
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => handleLikeToggle(comment.replyId)}  // id 확실히 전달
                                >
                                    <Heart
                                        className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                                    />
                                    <span className="text-sm">
                                        {comment.likesCount}
                                    </span>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                정말로 이 댓글을 삭제하시겠습니까?
                                                이 작업은 되돌릴 수 없습니다.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>취소</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(comment.replyId)}
                                                className="bg-red-500 hover:bg-red-600"
                                            >
                                                삭제
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <div className="flex-1">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="resize-none min-h-[40px] py-2 px-3 leading-[20px]"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="flex-shrink-0 h-[40px] w-[40px] p-0"
                        disabled={!newComment.trim() || isLoading}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>

            </div>
        </div>
    );
}