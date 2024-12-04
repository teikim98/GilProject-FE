import { useState } from "react";
import { Label } from '../ui/label';
import { Input } from "../ui/input";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTitle
} from '../ui/alert-dialog';

/**
 * 프로필 이미지 수정 컴포넌트
 * @param isPopupOpen 컴포넌트 여는 상태
 * @param setIsPopupOpen 컴포넌트 열어주는 함수
 * @param callback 완료됐을때 실행해줄 함수
 * @returns 
 */
const UpdateComment = ({postComment, isPopupOpen, setIsPopupOpen, callback, duplicateCheck } :{ postComment: string | null; isPopupOpen: boolean; setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; callback: (profileImgUrl: string) => void; duplicateCheck: boolean } ) => {
    const [comment, setComment]= useState(postComment ?? "입력된 자기소개글이 없습니다.");
    const [useButtonLock, setUseButtonLock] = useState(true);

    /**
     * 자기소개글 Input
     * @param e 
     */
    const handleComment = (e:any)=> {
        let value = e.target.value;
        value = value.replace(/[<>]/g, ""); //< > 입력 금지
        setComment(value);
        setUseButtonLock(false);
    };

    /**
     * 닫기 Button
     */
    const handleClose = (e: React.MouseEvent) =>{
        reset();
    };

    /**
     * 로컬 상태 모두 초기화
     */
    const reset = ()=>{
        setComment("");
    }
    
    /**
     * 저장 Button
     */
    const handleUse = (e: React.MouseEvent)=>{
        callback(comment);
        reset();
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
                        <Input
                            name="imageUrl"
                            type="text"
                            value={comment}
                            onChange={(e)=>handleComment(e)}
                        />
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
        </>
    );
};

export default UpdateComment;