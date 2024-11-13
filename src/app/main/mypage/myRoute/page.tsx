import BackHeader from '@/components/layout/BackHeader'
import BackButton from '@/components/layout/BackIcon'
import MyRouteList from '@/components/layout/myRouteCard'
import { Card } from '@/components/ui/card'
import React from 'react'

export default function page() {
    return (
        <div className='animate-fade-in flex flex-col relative'>
            <BackHeader link='/main/mypage' content='내 경로기록' />
            <MyRouteList />
        </div>
    )
}
