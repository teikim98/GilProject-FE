"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { emailLogin } from "@/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PopupData } from "../../../types/types_JHW";
import { NoticeContainer } from "@/components/notice/NoticeContainer";
import CustomDialoguePopup from "@/components/auth/CustomDialoguePopup";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { tokenClean } from "@/util/tokenCleaner";

const HomePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});

  const handleLogin = async () => {
    try {
      await emailLogin(email, password);
      router.push("/main");
    } catch (error) {
      console.error("로그인 실패", error);
      setPopupData({
        title: "오류",
        description: "로그인에 실패하였습니다.",
        content: "이메일 또는 비밀번호를 다시 한번 확인해주세요.",
        onConfirm: () => {
          setLoginPopupOpen(false);
        },
      });
      setLoginPopupOpen(true);
    }
  };

  useEffect(() => {
    tokenClean();
  }, []);

  return (
    <>
      {/* <div className="w-full max-w-screen-md p-4 space-y-4 animate-fade-in"> */}
      <div className="w-full animate-fade-in flex flex-col justify-center items-center min-h-screen">
        <div className="w-[80vw] h-[95vh] p-2 space-y-2 animate-fade-in">
          <NoticeContainer />
          {/* Card Component */}
          <Card className="max-w-screen-md">
            <CardHeader>
              <CardTitle>로그인</CardTitle>
              <CardDescription>필요한 정보를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // 기본 폼 제출 동작 방지
                  handleLogin(); // 로그인 처리 함수 호출
                }}
              >
                <div className=" w-full items-center gap-4 flex flex-col">
                  {/* Email Input */}
                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[<>]/g, "");
                        setEmail(value);
                      }}
                      onInput={(e: any) => {
                        e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                      }}
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[<>]/g, "");
                        setPassword(value);
                      }}
                      onInput={(e: any) => {
                        e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                      }}
                      placeholder="비밀번호를 입력해주세요"
                    />
                  </div>

                  {/* Social Login Buttons */}
                  <div className="flex flex-row justify-center items-center gap-4 w-full">
                    <div className="flex-1 flex justify-center">
                      <Link href="http://localhost:8080/oauth2/authorization/google" passHref>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/Resources/Google/web_neutral_sq_na@4x.png" />
                        </Avatar>
                      </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                      <Link href="http://localhost:8080/oauth2/authorization/naver" passHref>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/Resources/Naver/btnG_아이콘사각.png" />
                        </Avatar>
                      </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                      <Link href="http://localhost:8080/oauth2/authorization/kakao" passHref>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/Resources/Kakao/카카오톡.png" />
                        </Avatar>
                      </Link>
                    </div>
                  </div>
                  <Button type="submit" variant="outline" className="w-full bg-purple-400 hover:bg-purple-500" onClick={handleLogin}>
                    Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-5">
              <p className="text-xs">
                아직 회원이 아니라면{" "}
                <a href="/auth/signup" className="bg-slate-400">
                  여기
                </a>
                를 눌러 회원가입
              </p>
              <p className="text-xs">
                비밀번호를 잊으셨다면{" "}
                <a href="/auth/find" className="bg-slate-400">
                  여기
                </a>
                를 눌러 비밀번호 찾기
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      {loginPopupOpen && <CustomDialoguePopup popupData={popupData} />}
    </>
  );
};

export default HomePage;
