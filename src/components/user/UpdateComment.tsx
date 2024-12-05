import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTitle } from "../ui/alert-dialog";
import { changeComment } from "@/api/user";
import CustomDialoguePopup from "../auth/CustomDialoguePopup";
import { PopupData } from "@/types/types_JHW";

/**
 * 프로필 이미지 수정 컴포넌트
 * @param isPopupOpen 컴포넌트 여는 상태
 * @param setIsPopupOpen 컴포넌트 열어주는 함수
 * @param callback 완료됐을때 실행해줄 함수
 * @returns
 */
const UpdateComment = ({ postComment, isPopupOpen, setIsPopupOpen, callback}: { postComment: string | null; isPopupOpen: boolean; setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; callback: (profileImgUrl: string) => void;}) => {
  const [comment, setComment] = useState(postComment);
  const [useButtonLock, setUseButtonLock] = useState(true);
  const [isCustomPopupOpen, setIsCustomPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});

  /**
   * 자기소개글 Input
   * @param e
   */
  const handleComment = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[<>]/g, ""); //< > 입력 금지
    setComment(value);
    setUseButtonLock(false);
  };

  /**
   * 닫기 Button
   */
  const handleClose = (e: React.MouseEvent) => {
    reset();
  };

  /**
   * 로컬 상태 모두 초기화
   */
  const reset = () => {
    setComment(postComment);
  };

  /**
   * 저장 Button
   */
  async function handleUse(e: React.MouseEvent) {
    e.preventDefault();

    try {
      const result = await changeComment(comment);

      if (result === 1) {
        console.log("자기소개글 변경 성공");
        setPopupData({
          title: "성공",
          content: "자기소개글 변경 성공",
          onConfirm: () => {
            setIsCustomPopupOpen(false);
            setIsPopupOpen(false);
          },
        });
        setIsCustomPopupOpen(true);
      }
    } catch (error) {
      console.log("자기소개글 변경 실패");
      setPopupData({
        title: "오류",
        content: "자기소개글 변경 실패",
        onConfirm: () => {
          setIsCustomPopupOpen(false);
        },
      });
      setIsCustomPopupOpen(true);
    }

    callback(comment || "");
  }

  return (
    <>
      <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>자기소개글 수정</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid w-full items-center gap-4">
            <Label htmlFor="address">본인을 소개할 수 있는 문구를 적어주세요.</Label>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input name="imageUrl" type="text" value={comment || ""} placeholder="자기소개가 없습니다" onChange={(e) => handleComment(e)} />
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
              disabled={useButtonLock}
            >
              저장
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isCustomPopupOpen && <CustomDialoguePopup popupData={popupData} />}
    </>
  );
};

export default UpdateComment;
