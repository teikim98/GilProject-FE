import React, { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ValidateMessage from "./ValidateMessage";
import { Button } from "../ui/button";
import { checkKorOrEngOrNum, checkLength } from "@/util/Regex";
import CustomDialoguePopup from "./CustomDialoguePopup";
import { ChangePopupData, PopupData } from "@/types/types_JHW";
import { existNickname } from "@/api/auth";
import { changeNickname } from "@/api/user";

const NickNameChangePopup = (props: ChangePopupData) => {
  const [nickName, setNickName] = useState(props.initialData);
  const [isNickNameValid, setIsNickNameValid] = useState(false);
  const [isNickNameDuplicationValid, setIsNickNameDuplicationValid] = useState(false);
  const [nickNameValidMessage, setnickNameValidMessage] = useState("");
  const [isCustomPopupOpen, setIsCustomPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});

  /**
   * 유효성 검사 - 닉네임
   * @param e
   */
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

  /**
   * 닫기 Button
   * @param e
   */
  function handleClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    props.setIsPopupOpen(false);
    reset();
  }

  const reset = ()=>{
    setNickName(props.initialData);
    setIsNickNameValid(false);
    setIsNickNameDuplicationValid(false);
    setnickNameValidMessage("");
  }

  /**
   * 변경 Button
   * @param e
   */
  async function handleChange(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const result = await changeNickname(nickName);

    if (result === 1) {
      if(nickName) props.callback(nickName);
      setIsCustomPopupOpen(true);
      setPopupData({
        title: "성공",
        content: "닉네임 변경에 성공하셨습니다",
        onConfirm: () => {
          props.setIsPopupOpen(false);
          setIsCustomPopupOpen(false);
        },
      });
    } else {
      setIsCustomPopupOpen(true);
      setPopupData({
        title: "오류",
        content: "닉네임 변경에 실패하셨습니다",
        onConfirm: () => {
          setIsCustomPopupOpen(false);
        },
      });
    }
  }

  /**
   * 닉네임 입력 Input
   * @param e
   */
  function handleNickName(e: React.ChangeEvent<HTMLInputElement>): void {
    nickNameValidation(e);
  }

  /**
   * 중복 확인 Button
   * @param e
   */
  async function handleCheck(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    let response;
    if(nickName) response = await existNickname(nickName);

    if (response === 1) {
      setIsNickNameDuplicationValid(false);
      setnickNameValidMessage("이미 사용 중인 닉네임입니다");
    } else {
      setIsNickNameDuplicationValid(true);
      setnickNameValidMessage("사용 가능");
    }
  }

  return (
    <>
      <AlertDialog open={props.isPopupOpen} onOpenChange={props.setIsPopupOpen}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>닉네임 변경</AlertDialogTitle>
          </AlertDialogHeader>
          <form>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="address">변경할 닉네임을 입력해주세요</Label>

              <div className="flex flex-col space-y-1.5">
                <Input
                  name="nickname"
                  value={nickName}
                  onChange={(e) => handleNickName(e)}
                  placeholder="닉네임을 입력해주세요"
                  onInput={(e: any) => {
                    e.target.value = e.target.value.replace(/\s/g, ""); // 공백 제거
                  }}
                />
                <ValidateMessage validCondition={isNickNameValid && isNickNameDuplicationValid} message={nickNameValidMessage} />
                <Button
                  variant="outline"
                  className={`w-auto`}
                  onClick={(e) => {
                    handleCheck(e);
                  }}
                  disabled={!isNickNameValid}
                >
                  중복 확인
                </Button>
              </div>
            </div>
          </form>
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
                handleChange(e);
              }}
              disabled={!(isNickNameDuplicationValid && isNickNameValid)}
            >
              변경
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isCustomPopupOpen && <CustomDialoguePopup popupData={popupData} />}
    </>
  );
};

export default NickNameChangePopup;
