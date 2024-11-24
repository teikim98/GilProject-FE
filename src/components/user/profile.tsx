'use client'
import { useEffect, useState } from 'react'
import { Camera, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { updateAddress, updateProfileImage, getSimpleProfile } from '@/api/user'
import { useUserStore } from '@/store/useUserStore'

interface SimpleUserInfo {
    id: number;
    nickName: string;
    imageUrl: string;
    comment: string | null;
    address: string | null;
    postCount: number;
    likeCount: number;
    pathCount: number;
}

export default function Profile() {
    const [simpleInfo, setSimpleInfo] = useState<SimpleUserInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const user = useUserStore((state) => state.user)

    useEffect(() => {
        const fetchSimpleProfile = async () => {
            if (!user) {
                setError('로그인이 필요합니다')
                setLoading(false)
                return
            }

            try {
                const data = await getSimpleProfile(user.id)
                setSimpleInfo(data)
                setError(null)
            } catch (err) {
                setError('프로필을 불러오는데 실패했습니다')
                console.error('프로필 조회 에러:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchSimpleProfile()
    }, [user])

    const handleUpdateAddress = async (address: string, latitude: number, longitude: number) => {
        if (!user) return;

        try {
            setLoading(true)
            await updateAddress(user.id, address, latitude, longitude)
            const updatedInfo = await getSimpleProfile(user.id)
            setSimpleInfo(updatedInfo)
        } catch (err) {
            console.error('주소 업데이트 에러:', err)
            setError('주소 업데이트에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !user) return

        try {
            setLoading(true)
            await updateProfileImage(user.id, file)
            // 이미지 업로드 후 심플 정보 다시 불러오기
            const updatedInfo = await getSimpleProfile(user.id)
            setSimpleInfo(updatedInfo)
        } catch (err) {
            console.error('이미지 업로드 에러:', err)
            setError('이미지 업로드에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center">로딩중...</div>
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    if (!simpleInfo || !user) {
        return <div>프로필 정보를 불러올 수 없습니다</div>
    }

    return (
        <Card className="w-[350px]">
            <CardHeader className="mb-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="relative">
                            {simpleInfo.imageUrl ? (
                                <img
                                    src={simpleInfo.imageUrl}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <Camera className="w-10 h-10 p-2 bg-slate-100 rounded-full" />
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center">
                                <p className="mr-2 font-bold">
                                    {simpleInfo.nickName}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {simpleInfo.address || '주소 미설정'}
                                </p>
                            </div>
                            <p className="text-xs text-slate-500">
                                {simpleInfo.comment || '자기소개가 없습니다'}
                            </p>
                        </div>
                    </div>
                    <Pencil
                        className="align-top cursor-pointer hover:text-slate-600"
                        onClick={() => {/* 수정 모달 or 페이지로 이동 */ }}
                    />
                </div>
            </CardHeader>
            <CardContent className="mb-4">
                <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600">
                            내가 쓴 글
                        </p>
                        <p className="text-sm font-semibold">
                            {simpleInfo.postCount}
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600">
                            받은 좋아요
                        </p>
                        <p className="text-sm font-semibold">
                            {simpleInfo.likeCount}
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600">
                            따라걷기
                        </p>
                        <p className="text-sm font-semibold">
                            {simpleInfo.pathCount}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button
                    disabled={loading}
                    onClick={() => {/* 정보 수정 페이지로 이동 */ }}
                    className="w-full max-w-[200px]"
                >
                    정보 수정하기
                </Button>
            </CardFooter>
        </Card>
    )
}