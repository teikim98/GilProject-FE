import React from 'react';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import ValidateMessage from './ValidateMessage';
import { Button } from '../ui/button';


const NickNameChangePopup = () => {
  function handleClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    throw new Error('Function not implemented.');
  }

  function handleUse(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    throw new Error('Function not implemented.');
  }

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
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => handleEmail(e)}
              placeholder="이메일을 입력해주세요"
              readOnly={emailInputLock}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
              }}
            />
            <ValidateMessage validCondition={emailValidate} message={emailValidateMessage} />

            <Button
              variant="outline"
              className={`w-auto`}
              onClick={(e) => {
                handleCertifyCode(e, duplicateCheck);
              }}
              disabled={certifyButtonLock}
            >
              인증코드 발송
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              handleClose(e);
            }}
          >
            닫기
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              handleUse(e);
            }}
          >
            사용
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {/* {isCustomPopupOpen && <CustomDialoguePopup popupData={popupData}/>} */}
  </>
  );
};

export default NickNameChangePopup;