import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import ValidateMessage from "./ValidateMessage";
import { checkEmailForm } from "@/util/Regex";
import { existEmail } from "@/api/auth";
import { emailSend } from "@/api/mail";
import Timer from "./Timer";

/**
 * 이메일 인증 컴포넌트
 * @returns
 */
const EmailPopup = ({ isPopupOpen, setIsPopupOpen, callback }: { isPopupOpen: boolean; setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; callback: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const [emailValidateMessage, setEmailValidateMessage] = useState("");
  const [emailInputLock, setEmailInputLock] = useState(false);
  const [certifyButtonLock, setCertifyButtonLock] = useState(true);
  const [certifyCode, setCertifyCode] = useState("");
  const [userInputCertifyCode,setUserInputCertifyCode] = useState("");
  const [codeValidate, setCodeValidate] = useState(false);
  const [codeValidateMessage, setCodeValidateMessage] = useState("");
  const [useButtonLock,setUseButtonLock] = useState(true);
  const [certifyConfirmButtonLock, setCertifyConfirmButtonLock] = useState(false);

  //타이머 제한 시간
  const initialTime = 600;

  /**
   * 이메일 Input
   * @param e
   */
  const handleEmail = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, ""); //< > 입력 금지
    setEmail(value);

    //유효성 검사
    const check = checkEmailForm(value);
    setEmailValidate(check);
    if (check) {
      setEmailValidateMessage("인증코드 발송을 눌러주세요");
      setCertifyButtonLock(false);
    } else {
      setEmailValidateMessage("이메일 형식과 맞지 않습니다");
      setCertifyButtonLock(true);
    }
  };

  /**
   * 인증코드 발송 Button
   * @param e
   */
  const handleCertifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCertifyButtonLock(true);
    setEmailInputLock(true);

    //이메일 중복 체크
    if (await isEmailDuplicate(email)) {
      setEmailValidate(false);
      setEmailValidateMessage("중복된 이메일입니다 다른 이메일을 사용해주세요");

      setEmailInputLock(false);
    } else {
      //인증코드 전송
      const code = await sendEmail(email);
      setCertifyCode(code);
    }
  };

  /**
   * 인증코드 입력 Input
   */
  const handleUserCertifyCode =(e:any)=>{
    let value = e.target.value;
    value = value.replace(/[<>]/g, ""); //< > 입력 금지
    setUserInputCertifyCode(value);
  }

  /**
   * 인증코드 확인 Button
   */
  const handleCertifyCodeConfirm = (e:React.MouseEvent)=>{
    e.preventDefault();

    if(certifyCode === userInputCertifyCode){
      setCodeValidate(true);
      setCodeValidateMessage("인증코드 확인완료");
      setCertifyButtonLock(true);
      setCertifyConfirmButtonLock(true);
      setUseButtonLock(false);
      
    }
    else{
      setCodeValidate(false);
      setCodeValidateMessage("잘못된 인증코드입니다");
    }
  }

  /**
   * 닫기 Button
   */
  const handleClose = (e:React.MouseEvent)=>{
    reset();
  }

  /**
   * 로컬 상태 모두 초기화
   */
  const reset = ()=>{
    setEmail("");
    setEmailValidate(false);
    setEmailValidateMessage("");
    setEmailInputLock(false);
    setCertifyButtonLock(true);
    setCertifyCode("");
    setUserInputCertifyCode("");
    setCodeValidate(false);
    setCodeValidateMessage("");
    setUseButtonLock(true);
    setCertifyConfirmButtonLock(false);
  }

  /**
   * 사용 Button
   */
  const handleUse = (e:React.MouseEvent)=>{
    callback(email);
    reset();
  }

  /**
   * 인증 제한시간 타이머
   */
  const handleTimer =()=>{
    alert("코드입력 시간만료");
    reset();
  }

  /**
   * 이메일 중복체크
   * @param email
   * @returns
   */
  const isEmailDuplicate = async (email: string): Promise<boolean> => {
    const duplicate = await existEmail(email);
    return duplicate === 1;
  };

  /**
   * 인증 이메일 전송
   */
  const sendEmail = async (email: string): Promise<string> => {
    const response = await emailSend(email);
    return response + "";
  };


  return (
    <>
      <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>이메일 인증</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="address">보안을 위해 이메일 인증을 진행해주세요</Label>

            <div className="flex flex-col space-y-1.5">
              <Input name="email" type="email" value={email} onChange={(e) => handleEmail(e)} placeholder="이메일을 입력해주세요" readOnly={emailInputLock} />
              <ValidateMessage validCondition={emailValidate} message={emailValidateMessage} />

              <Button
                variant="outline"
                className={`w-auto`}
                onClick={(e) => {
                  handleCertifyCode(e);
                }}
                disabled={certifyButtonLock}
              >
                인증코드 발송
              </Button>

              {certifyCode !== "" && <>
              <Input value={userInputCertifyCode} onChange={(e) => {handleUserCertifyCode(e)}} placeholder="인증코드를 입력해주세요" readOnly={codeValidate}/>
              {!codeValidate && <Timer initialTime={initialTime} onComplete={handleTimer}/>}
              <Button variant="outline" className={`w-auto`} onClick={(e) => { handleCertifyCodeConfirm(e);}} disabled={certifyConfirmButtonLock} > 인증코드 확인 </Button>
              <ValidateMessage validCondition={codeValidate} message={codeValidateMessage}/>
              </>
              }
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {handleClose(e)}}>닫기</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => {handleUse(e)}} disabled={useButtonLock}>사용</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmailPopup;
