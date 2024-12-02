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
    <Button className="w-full h-full flex bg-transparent hover:bg-gray-100 text-black transition duration-200"
    onClick={(e)=>{handleNotice(e)}} >
      {/* 날짜 */}
      <div className="text-sm font-semibold px-2 py-1 border rounded-full bg-purple-200 text-gray-700">
        {formatDate(notice.writeDate)}
      </div>

      {/* 제목 */}
      <div className="flex-grow mx-4 text-xl font-bold text-center ">
        {notice.title}
      </div>

      {/* <Button onClick={(e)=>{handleNotice(e)}}>확인</Button> */}

      {isDialogOpen && 
        <NoticeDetail 
          notice={notice} 
          onClose={() => setIsDialogOpen(false)} // 닫기 함수 전달
        />}
    </Button>
  );
};

export default NoticeComponent;
