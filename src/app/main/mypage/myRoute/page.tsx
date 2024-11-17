import BackHeader from '@/components/layout/BackHeader'
import MyRouteList from '@/components/layout/myRouteCard'
import React from 'react'

export default function Page() {
    return (
        <div className='animate-fade-in flex flex-col relative'>
            <BackHeader content='내 경로기록' />
            <MyRouteList />
        </div>
    )
}
