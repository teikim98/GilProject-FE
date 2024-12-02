'use client'

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Profile from "./profile"
import { useState, useEffect } from "react"
import { getSimpleProfile, getDetailProfile } from '@/api/user'
import { jwtDecode } from 'jwt-decode'
import { subscribeUser, unsubscribeUser } from '@/api/subscribe'
import { toast } from "@/hooks/use-toast"

interface ProfileDialogProps {
    userId: number;
    className?: string;
    onOpenChange?: (open: boolean) => void;
}

interface ProfileInfo {
    id: number;
    nickName: string;
    imageUrl: string;
    comment: string | null;
    address: string | null;
    postCount: number;
    subscribeByCount: number;
    pathCount: number;
    isSubscribed?: boolean;
}

interface JWTPayload {
    id: number;
}

export default function ProfileDialog({ userId, className, onOpenChange }: ProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDetailView, setIsDetailView] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        const fetchInitialProfile = async () => {
            try {
                const data = await getSimpleProfile(userId);
                setProfileInfo(data);
                setError(null);
            } catch (err) {
                console.error('초기 프로필 조회 에러:', err);
                setError('프로필을 불러오는데 실패했습니다');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialProfile();
    }, [userId]);

    useEffect(() => {
        const fetchFullProfile = async () => {
            if (!open) return;

            try {
                const token = localStorage.getItem("access");
                if (!token) {
                    setError('인증 정보가 없습니다');
                    return;
                }

                const decoded = jwtDecode<JWTPayload>(token);
                if (decoded.id === userId) {
                    setIsDetailView(true);
                    const detailData = await getDetailProfile();
                    setProfileInfo(prev => prev ? {
                        ...prev,
                        ...detailData,
                        imageUrl: prev.imageUrl || detailData.imageUrl,
                    } : null);
                } else {
                    const data = await getSimpleProfile(userId);
                    setProfileInfo(prev => prev ? {
                        ...prev,
                        ...data,
                        imageUrl: prev.imageUrl || data.imageUrl
                    } : null);
                }
                setError(null);
            } catch (err) {
                setError('프로필을 불러오는데 실패했습니다');
                console.error('프로필 조회 에러:', err);
            }
        };

        if (open) {
            fetchFullProfile();
        }
    }, [userId, open]);

    const handleSubscribeToggle = async () => {
        if (!profileInfo || isSubscribing) return;

        setIsSubscribing(true);
        try {
            if (profileInfo.isSubscribed) {
                await unsubscribeUser(profileInfo.id);
                toast({
                    title: "구독 취소",
                    description: "구독을 취소했습니다",
                });
                setProfileInfo(prev => prev ? {
                    ...prev,
                    isSubscribed: false,
                    subscribeByCount: prev.subscribeByCount - 1
                } : null);
            } else {
                await subscribeUser(profileInfo.id);
                toast({
                    title: "구독 완료",
                    description: "구독했습니다",
                });
                setProfileInfo(prev => prev ? {
                    ...prev,
                    isSubscribed: true,
                    subscribeByCount: prev.subscribeByCount + 1
                } : null);
            }
        } catch (error) {
            console.error('구독 상태 변경 실패:', error);
            toast({
                variant: "destructive",
                title: "오류 발생",
                description: "구독 상태 변경에 실패했습니다",
            });
        } finally {
            setIsSubscribing(false);
        }
    };

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!open) {
            setOpen(true);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div
                    className="inline-block"
                    onClick={handleInteraction}
                    onMouseDown={handleInteraction}
                    onTouchStart={handleInteraction}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <Avatar className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
                        <AvatarImage src={profileInfo?.imageUrl} />
                        <AvatarFallback>{profileInfo?.nickName?.[0]}</AvatarFallback>
                    </Avatar>
                </div>
            </DialogTrigger>
            <DialogContent
                className="p-0 sm:max-w-[425px] flex flex-col min-h-[200px]"
                onPointerDownOutside={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenChange(false);
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <Profile
                    profileInfo={profileInfo}
                    loading={loading || isSubscribing}
                    error={error}
                    isDetailView={isDetailView}
                    onSubscribeToggle={handleSubscribeToggle}
                    width="w-full"
                />
            </DialogContent>
        </Dialog>
    );
}