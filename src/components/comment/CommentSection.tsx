'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment, toggleCommentLike } from "@/api/comment";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ProfileDialog from "../user/ProfileDialog";
import { jwtDecode } from "jwt-decode";
import { getTimeAgo } from "@/util/dateUtils";

interface CommentSectionProps {
    postId: number;
}

interface Reply {
    replyId: number;
    replyUserId: number;
    content: string;
    replyDate: string;
    nickName: string;
    likesCount: number;
    isLiked: boolean;
}

interface JWTPayload {
    id: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Reply[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedToken = localStorage.getItem("access");
        setToken(storedToken);

        if (storedToken) {
            try {
                const decoded = jwtDecode<JWTPayload>(storedToken);
                setUserId(decoded.id);
            } catch (error) {
                console.error("Token decode error:", error);
            }
        }
    }, []);

    const fetchComments = async () => {
        if (!isMounted) return;

        try {
            const data = await getComments(postId);
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
        if (isMounted) {
            fetchComments();
        }
    }, [postId, isMounted]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !token) return;

        setIsLoading(true);
        try {
            await createComment(postId, newComment);
            await fetchComments();
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

    const handleDelete = async (replyId: number) => {
        if (!replyId || !token) return;

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

    const handleLikeToggle = async (replyId: number) => {
        if (!replyId || !token) return;

        try {
            await toggleCommentLike(postId, replyId);
            await fetchComments();
        } catch (error) {
            toast({
                description: "좋아요 처리에 실패했습니다."
            });
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-4 mb-16">
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment.replyId} className="flex gap-3 py-3">
                        <ProfileDialog userId={comment.replyUserId} />

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
                                    onClick={() => handleLikeToggle(comment.replyId)}
                                >
                                    <Heart
                                        className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                                    />
                                    <span className="text-sm">
                                        {comment.likesCount}
                                    </span>
                                </Button>
                                {userId === comment.replyUserId && (
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
                                )}
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
                            disabled={isLoading || !token}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="flex-shrink-0 h-[40px] w-[40px] p-0"
                        disabled={!newComment.trim() || isLoading || !token}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}