'use client'
import { Camera, Loader2, Pencil, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { updateProfileImage } from '@/api/user'

interface ProfileInfo {
    id: number;
    nickName: string;
    imageUrl: string;
    comment: string | null;
    address: string | null;
    postCount: number;
    pathCount: number;
    subscribeByCount: number,
    isSubscribed?: boolean;
    point: number;
}

interface ProfileProps {
    profileInfo: ProfileInfo | null;
    loading: boolean;
    error: string | null;
    isDetailView: boolean;
    onSubscribeToggle: () => Promise<void>;
    width?: string;
}

export default function Profile({
    profileInfo,
    loading,
    error,
    isDetailView,
    onSubscribeToggle,
    width = "w-full"
}: ProfileProps) {
    if (error) {
        return (
            <Card className={`${width} border-0 shadow-none min-h-[200px] flex items-center justify-center`}>
                <div className="text-destructive">{error}</div>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className={`${width} border-0 shadow-none min-h-[200px] flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">프로필 불러오는 중...</p>
                </div>
            </Card>
        );
    }

    if (!profileInfo) {
        return (
            <Card className={`${width} border-0 shadow-none min-h-[200px] flex items-center justify-center`}>
                <div className="text-muted-foreground">프로필 정보를 불러올 수 없습니다</div>
            </Card>
        );
    }

    return (
        <Card className={`${width} border-0 shadow-none`}>
            <CardHeader className="px-6 pb-3">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="relative">
                            <div className={`medal w-20 h-20 rounded-full ${profileInfo.point >= 5000 ? 'bg-[url(/medal/gold.png)]':profileInfo.point >= 3000 ? 'bg-[url(/medal/silver.png)]':profileInfo.point >= 1000 ? 'bg-[url(/medal/bronze.png)]':null} bg-cover bg-center`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {profileInfo.imageUrl ? (
                                <img
                                    src={profileInfo.imageUrl}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover"
                                    style={{ position: "absolute", transform: "translate(-50%, -50%)", top: "60%", left: "50%" }}
                                />
                                ) : (
                                    <Camera className="w-12 h-12 p-2 bg-muted rounded-full" style={{ position: "absolute", transform: "translate(-50%, -50%)", top: "60%", left: "50%" }}/>
                                )}
                                </div>
                                {isDetailView && (
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                updateProfileImage(profileInfo.id, file);
                                            }
                                        }}
                                        accept="image/*"
                                    />
                                )}
                            
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center gap-2">
                                <p className="font-bold text-lg text-foreground">
                                    {profileInfo.nickName}
                                </p>
                                {isDetailView && (
                                    <Pencil
                                        className="w-4 h-4 cursor-pointer hover:text-muted-foreground"
                                        onClick={() => {/* 수정 모달 or 페이지로 이동 */ }}
                                    />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {profileInfo.address || '주소 미설정'}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                    {profileInfo.comment || '자기소개가 없습니다'}
                </p>
            </CardHeader>
            <CardContent className="px-6 pb-3">
                <div className="w-full flex flex-row justify-between border rounded-lg p-4 bg-muted/50">
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-muted-foreground">내가 쓴 글</p>
                        <p className="text-lg font-semibold text-foreground">{profileInfo.postCount}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-muted-foreground">따라걷기</p>
                        <p className="text-lg font-semibold text-foreground">{profileInfo.pathCount}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-muted-foreground">구독자 수</p>
                        <p className="text-lg font-semibold text-foreground">{profileInfo.subscribeByCount}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="px-6 pt-0 flex justify-center gap-2">
                {isDetailView ? (
                    <Button
                        disabled={loading}
                        onClick={() => {/* 정보 수정 페이지로 이동 */ }}
                        className="w-[50%]"
                    >
                        정보 수정하기
                    </Button>
                ) : (
                    <>
                        <Button
                            variant={profileInfo.isSubscribed ? "outline" : "default"}
                            onClick={onSubscribeToggle}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            {profileInfo.isSubscribed ? '구독중' : '구독하기'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {/* 글 목록 보기 */ }}
                            disabled={loading}
                            className="flex-1"
                        >
                            글 목록 보기
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}