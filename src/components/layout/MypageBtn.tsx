import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface MypageBtnProps {
    link: string
    content: string
}

export default function MypageBtn({ link, content }: MypageBtnProps) {
    return (
        <Link href={`/main/mypage/${link}`}>
            <Button className="w-full h-16 flex justify-between items-center">
                <span className="text-lg">{content}</span>
                <ArrowRight className="h-5 w-5" />
            </Button>
        </Link>
    )
}