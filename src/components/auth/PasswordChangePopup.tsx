import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { changePassword } from "@/api/auth";
import { checkLength } from "@/util/Regex";
import ValidateMessage from "./ValidateMessage";
import { PopupData } from "@/types/types_JHW";

const PasswordChangePopup = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [ispasswordValid,setIsPasswordValid] = useState(false);
  const [passwordValidMessage,setPasswordValidMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({
    title: "",
    description: "",
    content: "",
    onConfirm: () => {},
  }); 

  /**
   * 비밀번호 Input
   * @param e
   */
  const handlePassword = (e: any)=>{
    let value = e.target.value;
    value = value.replace(/[<>]/g, "");
    setPassword(value);
  }

  // const handleNewPasswordConfirm = (e: any) => {
  //   let value = e.target.value;
  //   value = value.replace(/[<>]/g, "");
  //   setNewPasswordConfirm(value);
  // };

  /**
   * 확인 Button
   * @param e 
   */
  const handleUpdatePassword = async (e: React.MouseEvent)=>{
    e.preventDefault();
    try{
      const result = await changePassword(password,newPassword);

      console.log(result);
      
      if(result === "비밀번호가 일치하지 않습니다"){
        setPopupData({
          title : "오류",
          description : "비밀번호 변경 실패",
          content : "비밀번호가 일치하지 않습니다. 다시 확인해주세요."
        })
        setIsPopupOpen(true);
      }
      else{
        setPopupData({
          title : "성공",
          content : "비밀번호 변경에 성공하셨습니다"
        })
        setIsPopupOpen(true);
      }
    }
    catch(error){
      // console.log("비밀번호 변경 실패");
      setPopupData({
        title : "오류",
        content : "비밀번호 변경 실패"
      })
      setIsPopupOpen(true);
    }

  }

  //유효성 검사 - 새 비밀번호 필드
  const handleNewPassword = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setNewPassword(value);

    if (checkLength(value, 8, 30) === false) {
      setIsPasswordValid(false);
      setPasswordValidMessage("8글자 이상 30글자 이하만 가능합니다");
    } else if (value !== newPasswordConfirm) {
      setIsPasswordValid(false);
      setPasswordValidMessage("비밀번호가 일치하지 않습니다");
    } else {
      setIsPasswordValid(true);
      setPasswordValidMessage("사용가능한 비밀번호입니다");
    }
  };

  //유효성 검사 - 비밀번호 확인 필드
  const handleNewPasswordConfirm = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "").trim();
    setNewPasswordConfirm(value);

    if (value !== newPassword) {
      setIsPasswordValid(false);
      setPasswordValidMessage("비밀번호가 일치하지 않습니다");
    } else if (checkLength(newPassword, 8, 30) === false) {
      setIsPasswordValid(false);
      setPasswordValidMessage("8글자 이상 30글자 이하만 가능합니다");
    } else {
      setIsPasswordValid(true);
      setPasswordValidMessage("사용가능한 비밀번호입니다");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>필요한 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">비밀번호</Label>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    handlePassword(e);
                  }}
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                  }}
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">새 비밀번호</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    handleNewPassword(e);
                  }}
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                  }}
                  placeholder="새 비밀번호를 입력해주세요"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">새 비밀번호 확인</Label>
                <Input
                  type="password"
                  name="newPasswordConfirm"
                  value={newPasswordConfirm}
                  onChange={(e) => {
                    handleNewPasswordConfirm(e);
                  }}
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                  }}
                  placeholder="새 비밀번호를 다시 입력해주세요"
                />
              </div>
              <ValidateMessage validCondition={ispasswordValid} message={passwordValidMessage}/>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button variant="outline" className="w-full" onClick={(e)=>{handleUpdatePassword(e)}}
            disabled={!(ispasswordValid) || password===""}>
            확인
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PasswordChangePopup;
