import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { PopupData } from "@/types/types_JHW";

const CustomDialoguePopup = ({ popupData }: { popupData: PopupData }) => {
  return (
    <AlertDialog open={popupData.isOpen} onOpenChange={popupData.setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{popupData.title}</AlertDialogTitle>
          <AlertDialogDescription>{popupData.description}</AlertDialogDescription>
        </AlertDialogHeader>
        {popupData.content}
        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={onCancle}>취소</AlertDialogCancel> */}
          <AlertDialogAction onClick={popupData.onConfirm}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomDialoguePopup;
