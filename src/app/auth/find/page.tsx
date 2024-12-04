"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ValidateMessage from "@/components/auth/ValidateMessage";
import EmailPopup from "@/components/auth/EmailPopup";
import { passWordEmail } from "@/api/mail";
import { useRouter } from "next/navigation";
import { nameValidation } from "@/util/validation";
import { PopupData } from "@/types/types_JHW";
import CustomDialoguePopup from "@/components/auth/CustomDialoguePopup";

const HomePage = () => {
  let router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const [nameValidMessage, setNameValidMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailValidMessage, setEmailValidMessage] = useState("");
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [findButtonLock, setFindButtonLock] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});

  /**
   * 이름 입력 Input
   * @param e
   */
  const handleNameForm = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "");
    setName(value);

    nameValidation(value, setIsNameValid, setNameValidMessage);
  };

  /**
   * 이메일 인증 Button
   * @param e
   */
  const handleCertifyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEmailPopupOpen(true);
  };

  /**
   * 찾기 Button
   * @param e
   */
  const handleAuthFind = async (e: React.MouseEvent) => {
    e.preventDefault();
    setFindButtonLock(true);

    //랜덤한 비밀번호 이메일로 보내기
    const result = await passWordEmail(name, email);
    setFindButtonLock(false);

    // console.log(result);
    if (result === 1) {
      setPopupData({
        title: "성공",
        description : "새 비밀빈호가 이메일로 발급되었습니다.",
        content: "로그인 후 반드시 비밀번호를 변경해주세요",
        onConfirm: () => {
          setIsPopupOpen(false);
          router.push("/auth/login");
        },
      });
      setIsPopupOpen(true);
    } else {
      setPopupData({
        title: "오류",
        content: "입력하신 이름과 이메일에 일치하는 회원이 없습니다",
        onConfirm: () => {
          setIsPopupOpen(false);
          router.push("/auth/login");
        },
      });
      setIsPopupOpen(true);
    }
  };

  /**
   * 이메일 인증 콜백
   * @param email
   */
  const handleEmailVerified = (email: string) => {
    if (email !== "") {
      console.log(`인증된 이메일: ${email}`);
      setEmail(email);
      setIsEmailValid(true);
      setEmailValidMessage(`인증 완료 / ${email} `);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* Card Component */}
      <Card className="max-w-screen-md w-[80vw] h-[60vh] overflow-auto no-scrollbar">
        <CardHeader>
          <CardTitle>비밀번호 찾기</CardTitle>
          <CardDescription>필요한 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">이름</Label>
                <Input
                  name="name"
                  value={name}
                  onChange={(e) => {
                    handleNameForm(e);
                  }}
                  placeholder="이름을 입력해주세요"
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                  }}
                />
                <ValidateMessage validCondition={isNameValid} message={nameValidMessage} />

                <Label htmlFor="name">이메일</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    handleCertifyEmail(e);
                  }}
                >
                  이메일 인증
                </Button>
                <EmailPopup isPopupOpen={isEmailPopupOpen} setIsPopupOpen={setIsEmailPopupOpen} callback={handleEmailVerified} duplicateCheck={false} />
                <ValidateMessage validCondition={isEmailValid} message={emailValidMessage} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button
            variant="outline"
            className="w-full w-full bg-purple-400 hover:bg-purple-500"
            onClick={(e) => {
              handleAuthFind(e);
            }}
            disabled={!(isNameValid && isEmailValid) || findButtonLock}
          >
            {findButtonLock ? "확인 중... " : "확인"}
          </Button>
        </CardFooter>
      </Card>
      {isPopupOpen && <CustomDialoguePopup popupData={popupData} />}
    </div>
  );
};

export default HomePage;
