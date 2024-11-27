import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DaumPostcodeEmbed from "react-daum-postcode";
import Link from "next/link";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import DaumPostcode from "react-daum-postcode";
import { CheckboxIcon } from "@radix-ui/react-icons";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { updateAddress } from "@/api/user";

const AddressChangePopup = () => {
  const [isRouteListOpen, setIsRouteListOpen] = useState(true);
  const [openDaumPost, setOpenDaumPost] = useState(false);
  const [address, setAddress] = useState("");

  const handleComplete = (data: any) => {
    console.log(data);
    setAddress(data.address); // 선택한 주소 인풋필드에 올리기
    setOpenDaumPost(false); // 팝업 닫기

    updateAddr();
  };

  const handleSave = ()=>{
    //주소, 위도, 경도 회원테이블에 업데이트하기
    console.log("DB에 저장");
    // await updateAddress(,address, lat.toString(), lon.toString());
  }

  /**
   * 위도 경도로 변환
   * @returns
   */
  const updateAddr = async () => {
    const { lat, lon } = await conversionAddr(address);
    console.log("위도:", lat, "경도:", lon);
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
                    {/* 인풋필드가 비었으면 안되게 */}
                  </Button>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between items-center">
              {/* 왼쪽 끝: 체크박스와 멘트 */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms"/>
                <label htmlFor="terms">다시보지 않기</label>
              </div>

              {/* 오른쪽 끝: Link */}
              <div
                onClick={()=>{setIsRouteListOpen(false)}}
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
