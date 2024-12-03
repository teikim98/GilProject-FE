'use client'

import BackHeader from '@/components/layout/BackHeader'
import SubscriberPostList from '@/components/subscribe/SubscriberPostList'
import { useSearchParams } from 'next/navigation'

export default function Page() {
    const searchParams = useSearchParams();
    const nickName = searchParams.get('nickName');

    if (!nickName) {
        return <div>잘못된 접근입니다.</div>;
    }

    return (
        <div className='animate-fade-in flex flex-col relative pb-20'>
            <BackHeader content={`${nickName}님의 게시글 목록`} />
            <div className="p-4">  {/* 여기에 패딩 추가 */}
                <SubscriberPostList nickName={nickName} />
            </div>
        </div>
    );
}