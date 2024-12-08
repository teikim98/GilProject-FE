import React, { useState } from "react";
import { Button } from "../ui/button";
import { Notice } from "@/types/types_JHW";
import NoticeDetail from "./NoticeDetail";

const NoticeComponent = ({ notice }: { notice: Notice }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleNotice = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        className="w-full h-full flex items-center bg-transparent hover:bg-gray-100 text-black transition duration-200 dark:text-white dark:hover:bg-gray-700 overflow-hidden"
        onClick={(e) => handleNotice(e)}
      >
        <div className="text-sm font-semibold px-2 py-1 border rounded-full bg-purple-200 text-gray-700 flex-shrink-0">
          {formatDate(notice.writeDate)}
        </div>
        <div
          className="ml-1 flex-grow text-xl font-bold truncate text-center"
          style={{ minWidth: "0" }}
        >
          {notice.title}
        </div>
      </Button>

      {/* 다이얼로그 */}
      <NoticeDetail
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        notice={notice}
      />
    </>
  );
};

export default NoticeComponent;
