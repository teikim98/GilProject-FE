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
import { Button } from "../ui/button";
import { Camera } from "lucide-react";


/**
 * 프로필 이미지 수정 컴포넌트
 * @param isPopupOpen 컴포넌트 여는 상태
 * @param setIsPopupOpen 컴포넌트 열어주는 함수
 * @param callback 완료됐을때 실행해줄 함수
 * @returns 
 */
const UpdateprofileImg = ({imageUrl, isPopupOpen, setIsPopupOpen, callback, duplicateCheck } :{ imageUrl: string; isPopupOpen: boolean; setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; callback: (profileImgUrl: string) => void; duplicateCheck: boolean } ) => {
    const [profileImgUrl, setProfileImgUrl]= useState("여기를 클릭하여 수정할 이미지를 업로드해주세요");
    const [useButtonLock, setUseButtonLock] = useState(true);

    /**
     * 이미지 Url Input
     * @param e 
     */
    const handleImgUrl = (e:any)=> {
        let value = e.target.value;
        value = value.replace(/[<>]/g, ""); //< > 입력 금지
        setProfileImgUrl(value);
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
        setProfileImgUrl("");
    }
    
    /**
     * 사용 Button
     */
    const handleUse = (e: React.MouseEvent)=>{
        callback(profileImgUrl);
        reset();
    }

    
    
    return (
        <>
          <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                <AlertDialogTitle>프로필 이미지 수정</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="grid w-full items-center gap-4">
                    <Label htmlFor="address">프로필 이미지는 2MB 이하로 등록 가능합니다.</Label>
                                    {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    ) : (
                                    <Camera className="w-12 h-12 p-2 bg-muted rounded-full" />
                                    )}
                </div>
                <div className="relative">
                        <div className="flex flex-col space-y-1.5">
                        <Input
                            name="imageUrl"
                            type="text"
                            value={profileImgUrl}
                            onChange={(e)=>handleImgUrl}
                        />
                        </div>
                        <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {}}
                        accept="image/*"
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
                    사용
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
    );
};

export default UpdateprofileImg;