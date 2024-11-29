import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import DaumPostcode from "react-daum-postcode";
import { Checkbox } from "@/components/ui/checkbox";
import { updateAddress } from "@/api/user";

/**
 * 주소변경 컴포넌트
 * @returns 
 */
const AddressChangePopup = () => {
  const [isRouteListOpen, setIsRouteListOpen] = useState(true);
  const [openDaumPost, setOpenDaumPost] = useState(false);
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(0); //위도
  const [lon,setLon] = useState(0); //경도
  const [isChecked, setIsChecked] = useState(false); //다시보지않기 체크

  const handleComplete = (data: any) => {
    console.log(data);
    
    setAddress(data.address); //주소 설정
    updateAddr(); //위도 경도로 변환
    setOpenDaumPost(false); //팝업 닫기
  };

  const handleSave = async ()=>{
    //주소, 위도, 경도 회원테이블에 업데이트하기
    console.log("DB에 주소변경");
    await updateAddress(address,lat,lon);
    localStorage.setItem("address-popup","0");
    alert("저장 되었습니다!");
    setIsRouteListOpen(false);
  }

  /**
   * 위도 경도로 변환
   * @returns
   */
  const updateAddr = async () => {
    const { lat, lon } = await conversionAddr(address);
    console.log("위도:", lat, "경도:", lon);
    setLat(lat);
    setLon(lon);
  };

  /**
   * 주소를 위도, 경도로 변환
   * @param addr 주소
   * @returns 위도,경도 객체
   */
  const conversionAddr = async (addr: string) => {
    return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      kakao.maps.load(function () {
        const geocoder = new kakao.maps.services.Geocoder();

        const callback = function (result: any, status: any) {
          if (status === kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lon = result[0].x;
            resolve({ lat, lon });
          } else {
            reject("Failed to find address");
          }
        };

        geocoder.addressSearch(addr, callback);
      });
    });
  };

  /**
   * 체크박스 체크 이벤트
   * @param checked
   */
  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    if(checked){
      localStorage.setItem("address-popup","0");
    }
    else{
      localStorage.setItem("address-popup","1");
    }
  };

  /**
   * 다음에할래요 클릭 이벤트
   */
  const handleNextTimeButtonClick = ()=>{
    setIsRouteListOpen(false);
  }

  return (
    <>
      <Dialog open={isRouteListOpen} onOpenChange={setIsRouteListOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>주소 등록</DialogTitle>
          </DialogHeader>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">
                자택 주소를 등록하면 더욱 많고 유용한 정보를 보실 수 있습니다
              </Label>
              {!openDaumPost && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenDaumPost(true);
                  }}
                >
                  주소 검색
                </Button>
              )}
              {openDaumPost && (
                <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
                  <DaumPostcode onComplete={handleComplete} />
                </div>
              )}
              {address && (
                <>
                  <Input
                    id="address"
                    value={address}
                    readOnly
                    placeholder="입력된 주소"
                  />
                  <Button
                    variant="outline"
                    className="w-auto"
                    onClick={handleSave}
                  >
                    저장
                  </Button>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between items-center">

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={isChecked} onCheckedChange={handleCheckboxChange}/>
                <label htmlFor="terms">다시보지 않기</label>
              </div>

              <div
                // onClick={()=>{setIsRouteListOpen(false)}}
                onClick={handleNextTimeButtonClick}
                className="text-right text-blue-500 flex-shrink-0 cursor-pointer"
              >
                다음에 할래요
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressChangePopup;
