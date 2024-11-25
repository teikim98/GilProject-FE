'use client'

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Profile from "./profile"
import { useState } from "react"

interface ProfileDialogProps {
    nickName: string;
    userId: number;  // userId 추가
    className?: string;
}

export default function ProfileDialog({ nickName, userId, className }: ProfileDialogProps) {
    const [open, setOpen] = useState(false);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!open) {
            setOpen(true);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setTimeout(() => {
                setOpen(false);
            }, 0);
        } else {
            setOpen(true);
        }
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
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nickName}`} />
                        <AvatarFallback>{nickName[0]}</AvatarFallback>
                    </Avatar>
                </div>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[425px] flex items-center justify-center p-6"
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
                <div onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                    <Profile userId={userId} />
                </div>
            </DialogContent>
        </Dialog>
    )
}