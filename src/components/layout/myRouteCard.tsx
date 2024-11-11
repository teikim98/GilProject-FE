import KakaoMap from '@/app/providers/KakaoMap'
import React from 'react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'

interface MapProps {
    id: string;
}

export default function MyRouteCard({ id }: MapProps) {
    return (
        <div className="">
            <Card className='flex p-4 max-h-40'>
                <div className="min-w-32 h-32 mr-4">
                    <KakaoMap mapId={id} width='w-full' height='h-full' />
                </div>
                <div className="flex flex-col">
                    <h2 className='font-semibold'>어쩌구 저쩌구</h2>
                    <p className='text-slate-500 text-sm overflow-hidden'>나는 감정을 지배할수있따 Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea repellendus nostrum aliquid velit consectetur. Doloremque est totam cum sit, debitis officia corporis nemo saepe vero autem? Aliquid quasi officiis tenetur!</p>
                </div>
            </Card>
            <Separator className=' my-4' />
        </div>
    )
}
