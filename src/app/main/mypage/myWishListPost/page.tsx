import BackHeader from '@/components/layout/BackHeader'
import MyWishListPost from '@/components/layout/myWishListPostCard'
import React from 'react'

export default function Page() {
    return (
        <div className='animate-fade-in flex flex-col relative pb-20'>
            <BackHeader content='내가 찜한 산책길' />
            <MyWishListPost />
        </div>
    )
}
