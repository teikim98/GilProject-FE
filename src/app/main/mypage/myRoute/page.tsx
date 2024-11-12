import BackHeader from '@/components/layout/BackHeader'
import BackButton from '@/components/layout/BackIcon'
import MyRouteCard from '@/components/layout/myRouteCard'
import { Card } from '@/components/ui/card'
import React from 'react'

export default function page() {
    return (
        <div className='animate-fade-in flex flex-col relative'>
            <BackHeader link='/main/mypage' content='내 경로기록' />
            <MyRouteCard id='1' />
            <MyRouteCard id='2' />
            <MyRouteCard id='3' />
            <MyRouteCard id='4' />
            <MyRouteCard id='5' />
            <MyRouteCard id='6' />
        </div>
    )
}
