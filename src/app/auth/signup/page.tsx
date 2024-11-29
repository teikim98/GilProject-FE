"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { emailJoin, emailLogin, existEmail, existNickname } from "@/api/auth";
import { redirect, useRouter } from "next/navigation";
import EmailPopup from "../../../components/auth/EmailPopup";
import { emailSend } from "@/api/mail";
import {
  checkLength,
  checkKor,
  checkKorOrEngOrNum,
  checkEmailForm,
} from "@/util/Regex";
import ValidateMessage from "@/components/auth/ValidateMessage";
import EmailVerificationPopup, {
  EmailCertification,
} from "@/components/auth/EmailVerification";

//유효성 검사 - 이름 필드
export const nameValidation = (
  value: string,
  setIsNameValid: (isValid: boolean) => void,
  setNameValidMessage: (message: string) => void
) => {
  value = value.replace(/[<>]/g, "").trim();

  if (checkLength(value, 2, 12) === false) {
    setIsNameValid(false);
    setNameValidMessage("2글자 이상 12글자 이하만 가능합니다");
  } else if (checkKor(value) === false) {
    setIsNameValid(false);
    setNameValidMessage("한글만 입력 가능합니다");
  } else {
    setIsNameValid(true);
    setNameValidMessage("사용 가능");
  }
};

const HomePage = () => {
  let router = useRouter();

  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  //회원가입을 하기 위한 유효성 검사
  const [isNameValid, setIsNameValid] = useState(false);
  const [isNickNameValid, setIsNickNameValid] = useState(false);
  const [isNickNameDuplicationValid, setIsNickNameDuplicationValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  //하단 유효성 검사 안내 메세지
  const [nameValidMessage, setNameValidMessage] = useState("");
  const [nickNameValidMessage, setnickNameValidMessage] = useState("");
  const [passwordValidMessage, setPasswordValidMessage] = useState("");
  const [emailValidMessage,setEmailValidMessage] = useState("");

  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);

  const handleEmailVerified = (email: string) => {
    if(email !==""){
      console.log(`인증된 이메일: ${email}`);
      setEmail(email);
      setIsEmailValid(true);
      setEmailValidMessage(`인증 완료 / ${email} `);
    }
  };


  const handleEmailPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEmailPopupOpen(true);
  };

  //유효성 검사 - 이름 필드
  // const nameValidation = (e: any) => {
  //   let value = e.target.value;
  //   value = value.replace(/[<>]/g, "").trim();
  //   setName(value);

  //   if (checkLength(value, 2, 12) === false) {
  //     setIsNameValid(false);
  //     setNameValidMessage("2글자 이상 12글자 이하만 가능합니다");
  //   } else if (checkKor(value) === false) {
  //     setIsNameValid(false);
  //     setNameValidMessage("한글만 입력 가능합니다");
  //   } else {
  //     setIsNameValid(true);
  //     setNameValidMessage("사용 가능");
  //   }
  // };

  //유효성 검사 - 닉네임 필드
  const nickNameValidation = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setNickName(value);

    setIsNickNameValid(false);
    setIsNickNameDuplicationValid(false);
    setnickNameValidMessage("");

    if (checkLength(value, 2, 12) === false) {
      setIsNickNameValid(false);
      setnickNameValidMessage("2글자 이상 12글자 이하만 가능합니다");
    } else if (checkKorOrEngOrNum(value) === false) {
      setIsNickNameValid(false);
      setnickNameValidMessage("한글, 영어, 숫자, _만 입력가능합니다");
    } else {
      setIsNickNameValid(true);
      setnickNameValidMessage("닉네임 중복 확인을 해주세요");
    }
  };

  //유효성 검사 - 비밀번호 필드
  const passwordValidation = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setPassword(value);

    if (checkLength(value, 8, 30) === false) {
      setIsPasswordValid(false);
      setPasswordValidMessage("8글자 이상 30글자 이하만 가능합니다");
    } else if (value !== passwordConfirm) {
      setIsPasswordValid(false);
      setPasswordValidMessage("비밀번호가 일치하지 않습니다");
    } else {
      setIsPasswordValid(true);
      setPasswordValidMessage("사용가능한 비밀번호입니다");
    }
  };

  //유효성 검사 - 비밀번호 확인 필드
  const passwordConfirmValidation = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setPasswordConfirm(value);

    if (value !== password) {
      setIsPasswordValid(false);
      setPasswordValidMessage("비밀번호가 일치하지 않습니다");
    } else if (checkLength(password, 8, 30) === false) {
      setIsPasswordValid(false);
      setPasswordValidMessage("8글자 이상 30글자 이하만 가능합니다");
    } else {
      setIsPasswordValid(true);
      setPasswordValidMessage("사용가능한 비밀번호입니다");
    }
  };

  const handleJoin = async () => {
    // console.log(name,nickName,email,password);
    try {
      const response = await emailJoin({ name, nickName, email, password });
      if (response === 1) {
        alert("회원가입 성공!");
        router.push("http://localhost:3000/auth/login");
      } else if (response === 0) {
        alert("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 API 자체가 실패", error);
    }
  };

  /**
   * 중복 닉네임 확인
   */
  const checkNickname = async (e: React.MouseEvent) => {
    e.preventDefault();

    const response = await existNickname(nickName);

    if (response === 1) {
      setIsNickNameDuplicationValid(false);
      setnickNameValidMessage("이미 사용 중인 닉네임입니다");
    } else {
      setIsNickNameDuplicationValid(true);
      setnickNameValidMessage("사용 가능");
    }
  };

  return (
    <div className="w-full max-w-screen-md p-4 space-y-4 animate-fade-in">
      {/* Card Component */}
      <Card className="max-w-screen-md">
        <CardHeader>
          <CardTitle>회원 가입</CardTitle>
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
                    let value = e.target.value;
                    setName(value);
                    nameValidation(value, setIsNameValid, setNameValidMessage);
                  }}
                  placeholder="이름을 입력해주세요"
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                  }}
                />
                <ValidateMessage
                  validCondition={isNameValid}
                  message={nameValidMessage}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">닉네임</Label>
                <Input
                  name="nickName"
                  value={nickName}
                  onChange={(e) => nickNameValidation(e)}
                  placeholder="닉네임을 입력해주세요"
                />
                <Button
                  name="nickNameCheckBtn"
                  variant="outline"
                  className="w-auto"
                  onClick={(e) => {
                    checkNickname(e);
                  }}
                  disabled={!isNickNameValid || isNickNameDuplicationValid}
                >
                  닉네임 중복 확인
                </Button>
                <ValidateMessage
                  validCondition={isNickNameValid && isNickNameDuplicationValid}
                  message={nickNameValidMessage}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">이메일</Label>
                {/* 기존 */}
                {/* <EmailCertification parentSetEmail={setEmail} parentSetEmailValid={setIsEmailValid}/> */}
                {/* 수정 */}
                <Button
                  name="nickNameCheckBtn"
                  variant="outline"
                  className="w-auto"
                  onClick={(e) => {
                    handleEmailPopup(e);
                  }}
                >
                 {!isEmailValid ? "이메일 인증" : "이메일 변경"}
                </Button>
                <EmailPopup
                  isPopupOpen={isEmailPopupOpen}
                  setIsPopupOpen={setIsEmailPopupOpen}
                  callback={handleEmailVerified}
                  duplicateCheck={true}
                />
                <ValidateMessage validCondition={isEmailValid} message={emailValidMessage}/>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">비밀번호</Label>
                <Input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => passwordValidation(e)}
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">비밀번호 확인</Label>
                <Input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => passwordConfirmValidation(e)}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                <ValidateMessage
                  validCondition={isPasswordValid}
                  message={passwordValidMessage}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleJoin}
            disabled={
              !(
                isNameValid &&
                isNickNameValid &&
                isNickNameDuplicationValid &&
                isEmailValid &&
                isPasswordValid
              )
            }
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePage;
