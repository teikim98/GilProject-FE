import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { PopupData } from "@/types/types_JHW";

const CustomDialoguePopup = ({ popupData }: { popupData: PopupData }) => {
  const [isOpen,setIsOpen] = useState(true);

  const handleAction = ()=>{
    if(popupData.onConfirm) popupData.onConfirm();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{popupData.title}</AlertDialogTitle>
          <AlertDialogDescription>{popupData.description}</AlertDialogDescription>
        </AlertDialogHeader>
        {popupData.content}
        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={onCancle}>취소</AlertDialogCancel> */}
          <AlertDialogAction onClick={handleAction}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomDialoguePopup;
