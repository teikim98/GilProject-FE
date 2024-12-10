"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { emailLogin } from "@/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PopupData } from "@/types/types_JHW";
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
    if (localStorage.getItem("access") !== null) {
      window.location.href = "/main";
    }
  }, []);

  return (
    <>
      <div className="w-full h-full animate-fade-in flex flex-col items-center min-h-screen">
        <div className="w-[90vw] h-[95vh] max-w-screen-md p-2 space-y-2 animate-fade-in flex flex-col justify-center items-center">
          <NoticeContainer />
          <Card className="max-w-screen-md w-full">
            <CardHeader>
              <CardTitle>로그인</CardTitle>
              <CardDescription>필요한 정보를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <div className=" w-full items-center gap-4 flex flex-col">
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
                        e.target.value = e.target.value.replace(/\s/g, "");
                      }}
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>

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
                        e.target.value = e.target.value.replace(/\s/g, "");
                      }}
                      placeholder="비밀번호를 입력해주세요"
                    />
                  </div>

                  <div className="flex flex-row justify-center items-center gap-4 w-full">
                    <div className="flex-1 flex justify-center">
                      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`} passHref>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/Resources/Google/web_neutral_sq_na@4x.png" />
                        </Avatar>
                      </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/naver`} passHref>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/Resources/Naver/btnG_아이콘사각.png" />
                        </Avatar>
                      </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`} passHref>
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
            <CardFooter className="flex flex-col items-center space-y-2">
              <p className="text-sm">
                아직 회원이 아니라면{" "}
                <Link href="/auth/signup" className="text-purple-500 hover:text-purple-700 hover:underline transition-colors">
                  여기
                </Link>
                를 눌러 회원가입
              </p>
              <p className="text-sm ">
                비밀번호를 잊으셨다면{" "}
                <Link href="/auth/find" className="text-purple-500 hover:text-purple-700 hover:underline transition-colors">
                  여기
                </Link>
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