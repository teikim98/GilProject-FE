"use client";

import { useState } from "react";
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

import { emailLogin } from "@/api/auth";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await emailLogin(email, password);
      alert("로그인 성공!");
      router.push('/main')
      // 저장된 JWT 확인
      //const token = localStorage.getItem("access");
      //console.log("저장된 JWT:", token);

    } catch (error) {
      //  console.error("로그인 실패", error);
      alert("로그인 실패");
    }
  };

  return (
    <div className="w-full max-w-screen-md p-4 space-y-4 animate-fade-in">
      {/* Card Component */}
      <Card className="max-w-screen-md">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>필요한 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
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
              <div>

                <Button
                  className="w-full bg-slate-300 hover:bg-slate-500"
                  onClick={(e) => {
                    e.preventDefault();
                    location.href =
                      "http://localhost:8080/oauth2/authorization/google";
                  }}
                >
                  Continue with Google
                </Button>
              </div>
              <div>
                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-600"
                  onClick={(e) => {
                    e.preventDefault();
                    location.href =
                      "http://localhost:8080/oauth2/authorization/kakao";
                  }}
                >
                  Continue with Kakao
                </Button>
              </div>
              <div>
                <Button
                  className="w-full bg-blue-700 hover:bg-blue-900"
                  onClick={(e) => {
                    e.preventDefault();
                    location.href =
                      "http://localhost:8080/oauth2/authorization/naver";
                  }}
                >
                  Continue with Facebook
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button variant="outline" className="w-full" onClick={handleLogin}>
            Sign in
          </Button>
          <Button variant="outline" className="w-full" onClick={() => { router.push("/main") }}>
            메인화면 가기
          </Button>
          <h2>
            아직 회원이 아니라면{" "}
            <a href="/auth/signup" className=" bg-slate-500">
              여기를
            </a>{" "}
            눌러 회원가입
          </h2>

          <h2>
            비밀번호를 잊으셨다면{" "}
            <a href="/auth/find" className=" bg-slate-500">
              여기를
            </a>{" "}
            눌러 비밀번호 찾기
          </h2>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePage;
