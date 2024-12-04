'use client'

import { Camera } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface SideProfileProps {
    profileInfo: {
        nickName: string;
        imageUrl: string;
        postCount: number;
        pathCount: number;
        subscribeByCount: number;
        point: number;
    } | null;
    loading: boolean;
    error: string | null;
}

export default function SideProfile({
    profileInfo,
    loading,
    error,
}: SideProfileProps) {
    if (error || loading || !profileInfo) {
        return null;
    }

    return (
        <Card className="border-0 shadow-none mb-4">
            <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <div className={`medal w-20 h-20 rounded-full ${profileInfo.point >= 500 ? 'bg-[url(/medal/gold.png)]' : profileInfo.point >= 300 ? 'bg-[url(/medal/silver.png)]' : profileInfo.point >= 100 ? 'bg-[url(/medal/bronze.png)]' : null} bg-cover bg-center`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {profileInfo.imageUrl ? (
                                    <img
                                        src={profileInfo.imageUrl}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                        style={{ position: "absolute", transform: "translate(-50%, -50%)", top: "60%", left: "50%" }}
                                    />
                                ) : (
                                    <Camera className="w-12 h-12 p-2 bg-muted rounded-full"  style={{ position: "absolute", transform: "translate(-50%, -50%)", top: "60%", left: "50%" }}/>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg">{profileInfo.nickName}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center bg-muted/50 rounded-lg p-3">
                    <div>
                        <p className="text-sm text-muted-foreground">내가 쓴 글</p>
                        <p className="font-semibold">{profileInfo.postCount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">따라걷기</p>
                        <p className="font-semibold">{profileInfo.pathCount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">구독자</p>
                        <p className="font-semibold">{profileInfo.subscribeByCount}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}