import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Notice } from "@/types/types_JHW";

const NoticeDetail = ({
  isDialogOpen,
  setIsDialogOpen,
  notice,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notice: Notice;
}) => {
  const formatDate = (dateString: string) => {
    const date = dateString.split("T")[0]; // 'T'를 기준으로 날짜 부분만 추출
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleClose = () => {
    console.log("닫기 클릭");
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog
      open={isDialogOpen} // 상태 관리
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen); // 이벤트 처리
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{notice.title}</AlertDialogTitle>
        </AlertDialogHeader>
        <hr />
        <p>{notice.content}</p>
        <hr />
        <p>{`작성일: ${formatDate(notice.writeDate)}`}</p>
        <AlertDialogAction onClick={handleClose}>닫기</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NoticeDetail;
