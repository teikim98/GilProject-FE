'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    route: string;
}

const BackButton = ({ className, route, ...props }: BackButtonProps) => {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(route)}
            className={` w-fit p-2 group flex items-center gap-1 hover:gap-2 transition-all ${className}`}
            {...props}
        >
            <ArrowLeft size={32} />
            <span>뒤로</span>
        </Button>
    );
};

export default BackButton;