import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface MypageBtnProps {
    link: string
    content: string
    onClick?: () => void  // onClick 핸들러 추가
}

export default function MypageBtn({ link, content, onClick }: MypageBtnProps) {
    // onClick이 있으면 Button만 반환
    if (onClick) {
        return (
            <Button 
                className="w-full h-16 flex justify-between items-center"
                onClick={onClick}
            >
                <span className="text-lg">{content}</span>
                <ArrowRight className="h-5 w-5" />
            </Button>
        );
    }

    // 기존 동작 유지
    return (
        <Link href={`/main/mypage/${link}`}>
            <Button className="w-full h-16 flex justify-between items-center">
                <span className="text-lg">{content}</span>
                <ArrowRight className="h-5 w-5" />
            </Button>
        </Link>
    )
}