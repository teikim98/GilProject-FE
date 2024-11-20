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
import { emailJoin, emailLogin } from "@/api/auth";
import { redirect, useRouter } from "next/navigation";
import { emailSend } from "@/api/mail";

const HomePage = () => {
  let router = useRouter();
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [userCertifyCode, setUserCertifyCode] = useState("");
  const [certifyCode, setCertifyCode] = useState("");

  const handleJoin = async () => {
    try {
      const response = await emailJoin({ name, nickName, email, password });
      if (response === 1) {
        alert("회원가입 성공!");
        // router.push("http://localhost:3000/auth/login");
        router.push("http://localhost:3000/auth/addr")
      } else if (response === 0) {
        alert("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 API 자체가 실패", error);
    }
  };

  /**
   * 인증 이메일 보내기
   * @param e
   */
  const sendEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    const response = await emailSend(email);
    setCertifyCode(response + "");
  };

  /**
   * 인증코드 맞는지 확인
   * @param e
   */
  const certifyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();

    userCertifyCode === certifyCode
      ? alert("인증코드 확인완료")
      : alert("인증 실패");
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">닉네임</Label>
                <Input
                  name="nickName"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  placeholder="닉네임을 입력해주세요"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">이메일</Label>
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력해주세요"
                />
                <Button
                  variant="outline"
                  className="w-auto"
                  onClick={(e) => sendEmail(e)}
                >
                  인증 이메일 보내기
                </Button>
                <Input
                  value={userCertifyCode}
                  onChange={(e) => setUserCertifyCode(e.target.value)}
                  placeholder="인증코드를 입력해주세요"
                />
                <Button
                  variant="outline"
                  className="w-auto"
                  onClick={certifyEmail}
                >
                  확인
                </Button>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">비밀번호</Label>
                <Input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">비밀번호 확인</Label>
                <Input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button variant="outline" className="w-full" onClick={handleJoin}>
            {/* 필드 유효성 검사 다 통과안하면 못누르게 */}
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePage;
