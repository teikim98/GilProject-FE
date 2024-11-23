import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { existEmail } from "@/api/auth";
import ValidateMessage from "./ValidateMessage";
import { emailSend } from "@/api/mail";
import { checkEmailForm } from "@/util/Regex";

/**
 * 이메일 입력필드, 버튼 컴포넌트
 */
export const EmailCertification = ({parentSetEmail,parentSetEmailValid} : {parentSetEmail :Dispatch<SetStateAction<string>>, parentSetEmailValid : Dispatch<SetStateAction<boolean>>}) => {
  const [email, setEmail] = useState("");
  //유효성검사
  const [isEmailValid, setIsEmailValid] = useState(false);
  //중복 검사
  const [isEmailDuplicate,setIsEmailDuplicate] = useState(false);


  //인증코드발송버튼을 눌러 인증을 진행할때 상태
  const [progressCertification, setProgressCertification] = useState(false);
  //서버측에서 이메일이 전송됨
  const [sentEmail, setSentEmail] = useState(false);
  //하단 유효성 검사 안내멘트
  const [emailMessage, setEmailMessage] = useState("");
  //서버에서 주는 인증코드
  const [certifyCode, setCertifyCode] = useState("");
  

   //유효성 검사 - 이메일 필드
   const emailValidate = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, "");
    setEmail(value);
    parentSetEmail(value);

    setIsEmailValid(false);
    setIsEmailDuplicate(false);
    setEmailMessage("");

    if (checkEmailForm(value) === false) {
      setIsEmailValid(false);
      setEmailMessage("이메일 형식과 맞지 않습니다");
    } else {
      setIsEmailValid(true);
      setEmailMessage("이메일 인증을 해주세요");
    }
  };

  /**
   * 인증코드 발송
   * @param e
   */
  const sendCertificationCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setProgressCertification(true);
    
    setEmailMessage("");
    const duplicate = await checkEmailDuplicate();
    if(duplicate){
      setIsEmailDuplicate(true);
      setEmailMessage("중복된 이메일입니다 다른 이메일을 사용해주세요");
      setProgressCertification(false);
    }
    else{
      setEmailMessage("인증 코드 전송 중...");

      const code = await sendEmail(email);
      setCertifyCode(code);
      setSentEmail(true);
      setEmailMessage("이메일로 인증코드를 발송했습니다");
    }
  };

  /**
   * 이메일 중복체크
   * @returns 
   */
  const checkEmailDuplicate= async () =>{
    const response = await existEmail(email);

   return response === 1;
  };

  /**
   * 인증 이메일 보내기
   * @param e
   */
  const sendEmail = async (email : string) => {
    const response = await emailSend(email);

    return response+"";
  };

  return (
    <>
      <Label htmlFor="name">이메일</Label>
      <Input
        name="email"
        type="email"
        value={email}
        onChange={(e) => emailValidate(e)}
        onInput={(e: any) => {
          e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
        }}
        placeholder="이메일을 입력해주세요"
        readOnly={progressCertification}
      />
      <Button
        variant="outline"
        className={`w-auto ${sentEmail ? "hidden" : ""}`}
        onClick={(e) => {
          sendCertificationCode(e);
        }}
        disabled={!isEmailValid || progressCertification || isEmailDuplicate}
      >
        인증코드 발송
      </Button>
      {sentEmail && <CodeCertification certifyCode={certifyCode} parentSetEmailValid={parentSetEmailValid} />}
      {!sentEmail && <ValidateMessage validCondition={isEmailValid && !isEmailDuplicate && progressCertification} message={emailMessage}/>}
    </>
  );
};

/**
 * 인증코드로 인증하는 컴포넌트
 * @param param0 
 * @returns 
 */
const CodeCertification = ({certifyCode, parentSetEmailValid} : {certifyCode : string, parentSetEmailValid : Dispatch<SetStateAction<boolean>>})=> {
  //유저가 입력한 인증코드
  const [userCertifyCode, setUserCertifyCode] = useState("");
  //인증코드 인증완료 -> 최종확인
  const [isCertifyCodeValid, setIsCertifyCodeValid] = useState(false);
  //하단 유효성 검사 안내멘트
  const [emailMessage, setEmailMessage] = useState("");


  /**
   * 인증코드가 서로 일치하는지 확인
   */
  const checkBothCode = (e : React.MouseEvent)=>{
    e.preventDefault();

    if(userCertifyCode === certifyCode){
      setIsCertifyCodeValid(true);
      parentSetEmailValid(true);
      setEmailMessage("인증코드 확인완료");
    }
    else{
      setIsCertifyCodeValid(false);
      parentSetEmailValid(false);
      setEmailMessage("잘못된 인증코드입니다");
    }


  }
  
  return (
    <>
      {/* 이메일 변경 버튼 */}
      <Input
        value={userCertifyCode}
        onChange={(e) => setUserCertifyCode(e.target.value)}
        placeholder="인증코드를 입력해주세요"
        readOnly={isCertifyCodeValid}
      />
      <Button
        variant="outline"
        className="w-auto"
        onClick={(e)=>checkBothCode(e)}
        disabled={isCertifyCodeValid}
      >
        확인
      </Button>
      {/* 인증코드 재발송 버튼 */}
      <ValidateMessage validCondition={isCertifyCodeValid} message={emailMessage}/>
    </>
  );
};

export default EmailCertification;
