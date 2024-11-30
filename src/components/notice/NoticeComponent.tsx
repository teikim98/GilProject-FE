import React, { useState } from "react";
import { Button } from "../ui/button";
import { Notice } from "@/types/types_JHW";
import NoticeDetail from "./NoticeDetail";

const NoticeComponent = ({ notice }: { notice: Notice }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog 상태

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear().toString().slice(-2); // 년도
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월 (0부터 시작하므로 1을 더해주고 2자리로 맞추기 위해 padStart 사용)
    const day = date.getDate().toString().padStart(2, "0"); // 일

    return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 반환
  };

  /**
   * 확인 Button
   * @param e 
   */
  function handleNotice(e: React.MouseEvent) {
    e.preventDefault();
    setIsDialogOpen(true);
  }

  return (
    <div className="flex items-center justify-between">
      {/* 날짜 */}
      <div className="text-sm font-semibold">
        {formatDate(notice.writeDate)}
      </div>

      {/* 제목 */}
      <div className="flex-grow mx-4 text-xl font-bold text-center">
        {notice.title}
      </div>

      <Button onClick={(e)=>{handleNotice(e)}}>확인</Button>

      {isDialogOpen && 
        <NoticeDetail 
          notice={notice} 
          onClose={() => setIsDialogOpen(false)} // 닫기 함수 전달
        />}
    </div>
  );
};

export default NoticeComponent;
