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
import { nameValidation } from "../signup/page";
import ValidateMessage from "@/components/auth/ValidateMessage";
import { emailValidate } from "@/components/auth/EmailVerification";

const HomePage = () => {
  const [name, setName] =useState("");
  const [email, setEmail] =useState("");
  const [isNameValid,setIsNameValid] = useState(false);
  const [nameValidMessage,setNameValidMessage] = useState("");
  const [isEmailValid,setIsEmailValid] = useState(false);
  const [emailValidMessage,setEmailValidMessage] = useState("");
  const [isEmailDuplicate,setIsEmailDuplicate] = useState(false);


  const handleNameForm = (e : any)=>{
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setName(value);

    nameValidation(value,setIsNameValid,setNameValidMessage);
  }

  const handleEmailForm = (e : any)=>{
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setEmail(value);

    emailValidate(value,setIsEmailValid,setIsEmailDuplicate,setEmailValidMessage);
  }

  return (
    <div className="w-full max-w-screen-md p-4 space-y-4 animate-fade-in">
      {/* Card Component */}
      <Card className="max-w-screen-md">
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
                  onChange={(e) => {handleNameForm(e)}}
                  placeholder="이름을 입력해주세요"
                />
              </div>
              <ValidateMessage validCondition={isNameValid} message={nameValidMessage}/>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">이메일</Label>
                <Input
                  name="email"
                  value={email}
                  onChange={(e) => {handleEmailForm(e)}}
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <ValidateMessage validCondition={isEmailValid} message={emailValidMessage}/>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button variant="outline" className="w-full" onClick={() => {}}
            disabled={!(isNameValid && isEmailValid)}>
            이메일 인증
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePage;
