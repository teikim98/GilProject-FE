'use client'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Profile from "./profile"
import { useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode'
import { toast } from "@/hooks/use-toast"
import { useDetailProfile, useSimpleProfile } from '@/hooks/queries/useUserQuery'
import { useSubscribe, useUnsubscribe } from "@/hooks/queries/useSubscribe"

interface ProfileDialogProps {
    userId: number;
    className?: string;
    onOpenChange?: (open: boolean) => void;
}

interface JWTPayload {
    id: number;
}

export default function ProfileDialog({ userId, className, onOpenChange }: ProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const [isDetailView, setIsDetailView] = useState(false);

    const {
        data: simpleProfile,
        isLoading: simpleLoading,
        error: simpleError
    } = useSimpleProfile(userId);

    const {
        data: detailProfile,
        isLoading: detailLoading,
        error: detailError
    } = useDetailProfile();

    const { mutate: subscribe, isPending: isSubscribing } = useSubscribe();
    const { mutate: unsubscribe, isPending: isUnsubscribing } = useUnsubscribe();

    useEffect(() => {
        if (!open) return;

        const token = localStorage.getItem("access");
        if (!token) {
            return;
        }

        const decoded = jwtDecode<JWTPayload>(token);
        setIsDetailView(decoded.id === userId);
    }, [userId, open]);

    const handleSubscribeToggle = () => {
        if (!simpleProfile || isSubscribing || isUnsubscribing) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve, reject) => {
            if (simpleProfile.isSubscribed === 0) {
                subscribe(simpleProfile.id, {
                    onSuccess: () => {
                        toast({
                            title: "구독 완료",
                            description: "내 길잡이로 등록했습니다",
                        });
                        resolve();
                    },
                    onError: (error) => {
                        toast({
                            variant: "destructive",
                            title: "오류 발생",
                            description: "구독 상태 변경에 실패했습니다",
                        });
                        reject(error);
                    }
                });
            } else {
                unsubscribe(simpleProfile.id, {
                    onSuccess: () => {
                        toast({
                            title: "구독 취소",
                            description: "내 길잡이를 해제합니다.",
                        });
                        resolve();
                    },
                    onError: (error) => {
                        toast({
                            variant: "destructive",
                            title: "오류 발생",
                            description: "구독 상태 변경에 실패했습니다",
                        });
                        reject(error);
                    }
                });
            }
        });
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
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!open) {
                            setOpen(true);
                        }
                    }}
                >
                    <Avatar className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
                        <AvatarImage src={simpleProfile?.imageUrl} />
                        <AvatarFallback>{simpleProfile?.nickName?.[0]}</AvatarFallback>
                    </Avatar>
                </div>
            </DialogTrigger>
            <DialogContent
                className="p-0 sm:max-w-[425px] flex flex-col min-h-[200px]"
                onPointerDownOutside={(e) => {
                    e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <Profile
                    userId={userId}
                    isDetailView={isDetailView}
                    onSubscribeToggle={handleSubscribeToggle}
                    width="w-full"
                />
            </DialogContent>
        </Dialog>
    );
}