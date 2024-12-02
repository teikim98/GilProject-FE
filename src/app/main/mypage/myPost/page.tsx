import BackHeader from '@/components/layout/BackHeader'
import MyPostList from '@/components/layout/myPostCard'
import React from 'react'

export default function Page() {
    return (
        <div className='animate-fade-in flex flex-col relative pb-20'>
            <BackHeader content='내가 작성한 글 목록' />
            <MyPostList />
        </div>
    )
}
