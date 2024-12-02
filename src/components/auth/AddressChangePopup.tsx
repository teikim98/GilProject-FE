import React, { useEffect, useState } from "react";
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
  const [lat, setLat] = useState(0); // 위도
  const [lon, setLon] = useState(0); // 경도
  const [isChecked, setIsChecked] = useState(false); // 다시보지않기 체크

  useEffect(() => {
    // Kakao 지도 API 초기화
    kakao.maps.load(() => {
      console.log("Kakao Maps API 로드 완료");
    });
  }, []);

  /**
   * 주소 검색 완료 핸들러
   */
  const handleComplete = async (data: any) => {
    if (!data.address) {
      console.error("잘못된 주소 데이터");
      return;
    }
    setAddress(data.address); // 주소 설정
    setOpenDaumPost(false); // 팝업 닫기

    try {
      const { lat, lon } = await updateAddr(data.address); // 위도/경도 변환
      console.log("위도:", lat, "경도:", lon);
      setLat(lat);
      setLon(lon);
    } catch (error) {
      console.error("주소 변환 실패:", error);
    }
  };

  /**
   * 위도/경도 업데이트 함수
   */
  const updateAddr = async (addr: string) => {
    return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(addr, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve({ lat: Number(result[0].y), lon: Number(result[0].x) });
        } else {
          reject("주소 검색 실패");
        }
      });
    });
  };

  /**
   * 저장 버튼 클릭 핸들러
   */
  const handleSave = async () => {
    try {
      await updateAddress(address, lat, lon); // DB 업데이트
      localStorage.setItem("address-popup", "0");
      alert("저장되었습니다!");
      setIsRouteListOpen(false);
    } catch (error) {
      console.error("DB 업데이트 실패:", error);
    }
  };

  /**
   * 체크박스 변경 핸들러
   */
  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    localStorage.setItem("address-popup", checked ? "0" : "1");
  };

  /**
   * 다음에 할래요 클릭 핸들러
   */
  const handleNextTimeButtonClick = () => {
    setIsRouteListOpen(false);
  };

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
                  onClick={() => setOpenDaumPost(true)}
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
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={handleCheckboxChange}
                />
                <label htmlFor="terms">다시보지 않기</label>
              </div>
              <div
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
