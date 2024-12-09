"use client";

import { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import BackHeader from "@/components/layout/BackHeader";
import { getDetailProfile, updateProfileImage } from "@/api/user";
import { User } from "@/types/types";
import { Input } from "@/components/ui/input";
import NickNameChangePopup from "@/components/auth/NickNameChangePopup";
import AddressChangePopup from "@/components/auth/AddressChangePopup";
import PasswordChangePopup from "@/components/auth/PasswordChangePopup";
import UpdateComment from "@/components/user/UpdateComment";
import UpdateprofileImg from "@/components/user/updateprofileImg";
import { useInvalidateUserQueries } from "@/hooks/queries/useUserQuery";

export default function Page() {
  const [profileInfo, setProfileInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNickNamePopupOpen, setIsNickNamePopupOpen] = useState(false);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isUpdateImgPopupOpen, setIsUpdateImgPopupOpen] = useState(false);
  const [isUpdateCommentPopupOpen, setIsUpdateCommentPopupOpen] = useState(false);
  const invalidateUserQueries = useInvalidateUserQueries();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const detailData = await getDetailProfile();
        setProfileInfo(detailData);
        setError(null);
      } catch (err) {
        setError("프로필을 불러오는데 실패했습니다");
        console.error("프로필 조회 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const updatePassword = () => {
    setIsPasswordPopupOpen(true);
  }


  const handleProfileImgPopup = () => {
    console.log("프로필 바꾸러 가쟈!!");
    setIsUpdateImgPopupOpen(true);
  }

  const handleProfileImgVerified = async (inputImgUrl: string) => {
    if (inputImgUrl !== "") {
      // console.log(`입력된 프로필 이미지 Url: ${inputImgUrl}`);
      setProfileInfo(prev => prev ? { ...prev, imageUrl: inputImgUrl } : prev);
      await invalidateUserQueries();
    }
  }

  const handleCommentPopup = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    //console.log("자기소개글 바꾸러 가쟈!!");
    e.preventDefault();
    setIsUpdateCommentPopupOpen(true);
    await invalidateUserQueries();
  }

  const handleCommentVerified = async (inputComment: string) => {
    if (inputComment !== "") {
      //console.log(`입력된 자기소개글로 바꾸기 : ${inputComment}`);
      setProfileInfo(prev => prev ? { ...prev, comment: inputComment } : prev);
      await invalidateUserQueries();
    }
  }

  /**
     * 데에터 변경 후 콜백 함수
     * @param nickName
     */
  const dataChangeComplete = async (data: string) => {
    console.log("변경된 data = " + data);
    setProfileInfo(await getDetailProfile());
    await invalidateUserQueries();
  }

  if (error) {
    return (
      <div className='animate-fade-in flex flex-col pb-20'>
        <BackHeader content='마이 페이지' />
        <Card className="w-full border-0 shadow-none min-h-[200px] flex items-center justify-center">
          <div className="text-destructive">{error}</div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='animate-fade-in flex flex-col pb-20'>
        <BackHeader content='마이 페이지' />
        <Card className="w-full border-0 shadow-none min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">프로필 불러오는 중...</p>
          </div>
        </Card>
      </div>
    );
  }



  return (
    <div className='animate-fade-in flex flex-col pb-20'>
      <BackHeader content='마이 페이지' />
      <Card className="w-full border-0 shadow-none">
        <CardContent>
          <div className="flex flex-col">
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row items-center gap-5">
              <span className="font-bold text-base">프로필</span>
              <div className="relative" onClick={() => {
                handleProfileImgPopup()
              }}>
                {profileInfo?.imageUrl ? (
                  <img
                    src={profileInfo.imageUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Camera className="w-12 h-12 p-2 bg-muted rounded-full" />
                )}
              </div>
              <UpdateprofileImg imageUrl={profileInfo!.imageUrl} isPopupOpen={isUpdateImgPopupOpen} setIsPopupOpen={setIsUpdateImgPopupOpen} callback={handleProfileImgVerified} />
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-8">
              <span className="font-bold text-base">이름</span>
              <Input className='w-[61%] text-sm bg-gray-100 border-muted dark:bg-gray-900'
                name="name"
                value={profileInfo?.name}
                readOnly
              /></div>
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-6">
              <span className="font-bold text-base">이메일</span>
              <Input className='w-[60%] text-sm bg-gray-100 border-muted dark:bg-gray-900'
                name="email"
                value={profileInfo?.email || '이메일 미설정'}
                readOnly
              /></div>
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-6">
                <span className="font-bold text-base">닉네임</span>
                <Input className='w-[70%] text-sm dark:bg-gray-700'
                  name="nickName"
                  value={profileInfo?.nickName}
                  onChange={(e) => { setProfileInfo(prev => prev ? { ...prev, nickName: e.target.value } : prev); }}
                /></div>
              <Button
                onClick={() => { setIsNickNamePopupOpen(true) }}
                className="px-3"
              >변경</Button>
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-9">
              <span className="font-bold text-base">주소</span>
              <Input className='w-[70%] text-xs dark:bg-gray-700'
                name="address"
                value={profileInfo?.address || '주소 미설정'}
                readOnly
              /></div>
              <Button
                onClick={() => { setIsAddressPopupOpen(true) }}
                className="px-3"
              >변경</Button>
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">자기소개</span>
                <Input className='w-[70%] text-xs dark:bg-gray-700'
                  name="comment"
                  value={profileInfo?.comment || ""}
                  readOnly
                  onChange={(e) => setProfileInfo(prev => prev ? { ...prev, comment: e.target.value } : null)}
                  placeholder='자기소개가 없습니다'
                /></div>
              <Button
                onClick={(e) => {
                  handleCommentPopup(e);
                }}
                className="px-3"
              >변경</Button>
              <UpdateComment postComment={profileInfo!.comment} isPopupOpen={isUpdateCommentPopupOpen} setIsPopupOpen={setIsUpdateCommentPopupOpen} callback={handleCommentVerified} />
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">가입일자</span>
              <Input className='w-[61%] text-sm bg-gray-100 border-muted dark:bg-gray-900'
                name="comment"
                value={profileInfo?.joinDate.split("T")[0]}
                readOnly
              /></div>
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            <div className="flex flex-row items-center gap-8">
              <span className="font-bold text-base">비밀번호</span>
              <Button
                onClick={updatePassword}
                className="w-[40%] bg-red-600 text-white hover:bg-red-700"
              >
                비밀번호 변경
              </Button>
            </div>
            <Separator className='my-4 border-t-2 border-muted-foreground' />
            
            {/* <div className="flex flex-col items-center justify-center space-y-4">

            </div> */}
          </div>
        </CardContent>
        <CardFooter className="px-6 pt-0 flex justify-center">

        </CardFooter>
      </Card>
      <NickNameChangePopup initialData={profileInfo?.nickName} isPopupOpen={isNickNamePopupOpen} setIsPopupOpen={setIsNickNamePopupOpen} callback={dataChangeComplete} />
      <AddressChangePopup
        props={{
          isPopupOpen: isAddressPopupOpen,
          setIsPopupOpen: setIsAddressPopupOpen,
          callback: dataChangeComplete,
        }}
        isMypage={true}
      />
      <PasswordChangePopup isPopupOpen={isPasswordPopupOpen} setIsPopupOpen={setIsPasswordPopupOpen} callback={() => { }} />
    </div>

  );
}
