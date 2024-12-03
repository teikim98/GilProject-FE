import { AlertDialog, AlertDialogContent } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader } from "../ui/alert-dialog";

const updateprofileImg = () => {
    return (
        <>
          <AlertDialog>
            <AlertDialogContent>
                <AlertDialogHeader>
                <Label htmlFor="address">보안을 위해 이메일 인증을 진행해주세요</Label>   
                </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </>
    );
};

export default updateprofileImg;