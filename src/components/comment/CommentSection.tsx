'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send } from "lucide-react";
import { useState } from "react";

// 시간 계산 함수
const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
};

const dummyComments = [
    {
        id: 1,
        userNickName: "등산왕",
        profileImage: "/api/placeholder/40/40",
        content: "멋진 코스네요! 저도 한번 가보고 싶어요.",
        createdAt: "2024-11-14T10:00:00",
        likesCount: 5,
        isLiked: true
    },
    {
        id: 2,
        userNickName: "러너김",
        profileImage: "/api/placeholder/40/40",
        content: "풍경이 정말 아름답네요. 코스 공유 감사합니다!",
        createdAt: "2024-11-14T11:30:00",
        likesCount: 3,
        isLiked: false
    }
];

export function CommentSection() {
    const [newComment, setNewComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("새 댓글:", newComment);
        setNewComment("");
    };




    return (
        <div className="space-y-4 mb-16">


            {/* 댓글 목록 */}
            <div className="space-y-3">
                {dummyComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 py-3">
                        {/* 프로필 이미지 */}
                        <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={comment.profileImage} />
                            <AvatarFallback>{comment.userNickName[0]}</AvatarFallback>
                        </Avatar>

                        {/* 댓글 내용 영역 */}
                        <div className="flex-1 space-y-1">
                            {/* 유저 정보와 시간 */}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{comment.userNickName}</span>
                                <span className="text-sm text-gray-500">
                                    {getTimeAgo(comment.createdAt)}
                                </span>
                            </div>

                            {/* 댓글 내용 */}
                            <p className="text-gray-700 dark:text-gray-300">
                                {comment.content}
                            </p>

                            {/* 좋아요 버튼 */}
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                >
                                    <Heart
                                        className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''
                                            }`}
                                    />
                                    <span className="text-sm">
                                        {comment.likesCount}
                                    </span>
                                </Button>
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
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="flex-shrink-0 h-[40px] w-[40px] p-0"
                        disabled={!newComment.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}