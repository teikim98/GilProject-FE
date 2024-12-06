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
import { Camera } from "lucide-react";
import { processMarkerImage } from '../../util/imageUtils';
import { updateProfileImage } from '../../api/user';


/**
 * 프로필 이미지 수정 컴포넌트
 * @param isPopupOpen 컴포넌트 여는 상태
 * @param setIsPopupOpen 컴포넌트 열어주는 함수
 * @param callback 완료됐을때 실행해줄 함수
 * @returns 
 */
const UpdateprofileImg = ({imageUrl, isPopupOpen, setIsPopupOpen, callback} :{ imageUrl: string; isPopupOpen: boolean; setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; callback: (profileImgUrl: string) => void;} ) => {
    const [profileImg, setProfileImg] = useState(imageUrl); //화면에 보여지는 실제 이미지 파일(String)
    const [inputImg, setInputImg]= useState<File>(); //이미지 파일(File)
    const [useButtonLock, setUseButtonLock] = useState(true);
    const [error, setError] = useState<string>('');

    /**
     * 프로필 이미지 변경파일 업로드 시
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        const { errorMessage, compressedImage } = await processMarkerImage(file);

        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        if (compressedImage) {
            console.log("이미지 압축, 변환 완료!");
            setProfileImg(compressedImage);
            setInputImg(file);
            setUseButtonLock(false);
        }
    };


    /**
     * 닫기 Button (로컬 상태 모두 초기화)
     */
    const handleClose = (e: React.MouseEvent) =>{
        setProfileImg(imageUrl);
        setInputImg(undefined);

    };

    
    /**
     * 사용 Button
     */
    const handleUse = async (e: React.MouseEvent)=>{
       
        if(inputImg){
            e.preventDefault();

            const result = await updateProfileImage(inputImg);

            if(result === 1){
            console.log("자기소개글 변경 성공");
            } else{
            console.log("자기소개글 변경 실패")
            }

            callback(profileImg);
        }
        
    }

    
    
    return (
        <>
          <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>프로필 이미지 수정</AlertDialogTitle>
                </AlertDialogHeader>
                    <div className="grid w-full items-center gap-4">
                        <Label htmlFor="address">프로필 이미지는 20MB 이하로 등록 가능합니다.</Label>
                                    {profileImg ? (
                                    <img
                                        src={profileImg}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    ) : (
                                    <Camera className="w-12 h-12 p-2 bg-muted rounded-full" />
                                    )}
                    </div>

                    {/* 이미지 Url 넣는 Input */}
                    <div className="relative">
                        <div className="flex flex-col space-y-1.5">
                        <Input
                            name="imageUrl"
                            type="text"
                            value={inputImg?.name}
                            placeholder="여기를 클릭하여 수정할 이미지를 업로드해주세요"
                        />
                        </div>
                        <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        id="profile-image-upload"
                        />
                    </div>
                    {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                    )}  
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