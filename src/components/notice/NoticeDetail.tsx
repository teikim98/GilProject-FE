import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Notice } from "@/types/types_JHW";

const NoticeDetail = ({ notice, onClose }: { notice: Notice; onClose: () => void }) => {

  const formatDate = (dateString: string) => {
    const date = dateString.split('T')[0]; // 'T'를 기준으로 날짜 부분만 추출
    const [year, month, day] = date.split('-'); // 년-월-일로 나누기
    return `${year}-${month}-${day}`; // 년-월-일 형식으로 반환
  };


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{notice.title}</DialogTitle>
        </DialogHeader>
        <hr/>
        <p>{notice.content}</p>
        <hr/>
        <p>{`작성일: ${formatDate(notice.writeDate)}`}</p>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeDetail;
