'use client'
import { useEffect, useState } from 'react'
import { Camera, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { updateAddress, updateProfileImage, getSimpleProfile, getDetailProfile } from '@/api/user'
import { useUserStore } from '@/store/useUserStore'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
    id: number;
}

interface ProfileInfo {
    id: number;
    nickName: string;
    imageUrl: string;
    comment: string | null;
    address: string | null;
    postCount: number;
    likeCount: number;
    pathCount: number;
}

interface ProfileProps {
    userId?: number;
    width?: string;
}

export default function Profile({ userId, width = "w-350px" }: ProfileProps) {
    const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const user = useUserStore((state) => state.user)
    const [isDetailView, setIsDetailView] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let data: ProfileInfo;
                const token = localStorage.getItem("access");

                if (token) {
                    const decoded = jwtDecode<JWTPayload>(token);
                    // userId가 없거나 토큰의 id와 일치하면 상세 정보 조회
                    if (!userId || decoded.id === userId) {
                        setIsDetailView(true);
                        const detailData = await getDetailProfile();
                        // DetailProfile을 ProfileInfo 형식으로 변환
                        data = {
                            id: detailData.id,
                            nickName: detailData.nickName,
                            imageUrl: detailData.imageUrl,
                            comment: detailData.comment,
                            address: detailData.address,
                            postCount: detailData.posts?.length ?? 0,
                            likeCount: detailData.postLikes?.length ?? 0,
                            pathCount: detailData.paths?.length ?? 0
                        };
                    } else {
                        // 다른 사용자의 프로필은 심플 정보만 조회
                        data = await getSimpleProfile(userId);
                    }
                    setProfileInfo(data);

                    setError(null);
                }
            } catch (err) {
                setError('프로필을 불러오는데 실패했습니다');
                console.error('프로필 조회 에러:', err);
            } finally {
                setLoading(false);
                console.log(profileInfo)
            }
        };

        fetchProfile();
    }, [userId, user]);

    const handleUpdateAddress = async (address: string, latitude: number, longitude: number) => {
        if (!isDetailView || !user) return;

        try {
            setLoading(true);
            await updateAddress(address, latitude, longitude);
            const updatedData = await getDetailProfile();
            setProfileInfo({
                id: updatedData.id,
                nickName: updatedData.nickName,
                imageUrl: updatedData.imageUrl,
                comment: updatedData.comment,
                address: updatedData.address,
                postCount: updatedData.posts?.length ?? 0,
                likeCount: updatedData.postLikes?.length ?? 0,
                pathCount: updatedData.paths?.length ?? 0
            });
        } catch (err) {
            console.error('주소 업데이트 에러:', err);
            setError('주소 업데이트에 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isDetailView || !user) return;
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            await updateProfileImage(user.id, file);
            const updatedData = await getDetailProfile();
            setProfileInfo({
                id: updatedData.id,
                nickName: updatedData.nickName,
                imageUrl: updatedData.imageUrl,
                comment: updatedData.comment,
                address: updatedData.address,
                postCount: updatedData.posts?.length ?? 0,
                likeCount: updatedData.postLikes?.length ?? 0,
                pathCount: updatedData.paths?.length ?? 0
            });
        } catch (err) {
            console.error('이미지 업로드 에러:', err);
            setError('이미지 업로드에 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center">로딩중...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!profileInfo) {
        return <div>프로필 정보를 불러올 수 없습니다</div>;
    }

    return (
        <Card className={width}>
            <CardHeader className="mb-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="relative">
                            {profileInfo.imageUrl ? (
                                <img
                                    src={profileInfo.imageUrl}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <Camera className="w-10 h-10 p-2 bg-slate-100 rounded-full" />
                            )}
                            {isDetailView && (
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center">
                                <p className="mr-2 font-bold">
                                    {profileInfo.nickName}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {profileInfo.address || '주소 미설정'}
                                </p>
                            </div>
                            <p className="text-xs text-slate-500">
                                {profileInfo.comment || '자기소개가 없습니다'}
                            </p>
                        </div>
                    </div>
                    {isDetailView && (
                        <Pencil
                            className="align-top cursor-pointer hover:text-slate-600"
                            onClick={() => {/* 수정 모달 or 페이지로 이동 */ }}
                        />
                    )}
                </div>
            </CardHeader>
            <CardContent className="mb-4">
                <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600">
                            내가 쓴 글
                        </p>
                        <p className="text-sm font-semibold">
                            {profileInfo.postCount}
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600">
                            받은 좋아요
                        </p>
                        <p className="text-sm font-semibold">
                            {profileInfo.likeCount}
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-600">
                            따라걷기
                        </p>
                        <p className="text-sm font-semibold">
                            {profileInfo.pathCount}
                        </p>
                    </div>
                </div>
            </CardContent>
            {isDetailView && (
                <CardFooter className="flex justify-center">
                    <Button
                        disabled={loading}
                        onClick={() => {/* 정보 수정 페이지로 이동 */ }}
                        className="w-full max-w-[200px]"
                    >
                        정보 수정하기
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}