'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const BackButton = ({ className, ...props }: BackButtonProps) => {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className={`w-fit p-2 group flex items-center gap-1 hover:gap-2 transition-all ${className}`}
            {...props}
        >
            <ArrowLeft size={32} />
            <span>뒤로</span>
        </Button>
    );
};

export default BackButton;