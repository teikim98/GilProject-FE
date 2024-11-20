"use client";

import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useGeocoder } from "@/hooks/useGeocoder";

// declare const kakao : any;

const HomePage = () => {
  const [address, setAddress] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const { addressToCoords, isLoaded } = useGeocoder();

  // Kakao Maps SDK 동적 로드 상태 관리
  useEffect(() => {
    window.kakao.maps.load(() => {
      console.log("Kakao Maps SDK loaded");
      // const geocoder = new window.kakao.maps.services.Geocoder();
    });
  }, []);

  /**
   * 주소 api로 입력마쳤을때 부르는 함수
   * @param data
   */
  const handleComplete = (data: any) => {
    // console.log(data);
    setAddress(data.address); // 선택한 주소 저장
    setIsPopupOpen(false); // 팝업 닫기
  };

  /**
   * 위도 경도로 변환
   * @returns
   */
  const updateAddr = async () => {
    const { lat, lon } = await conversionAddr(address);
    console.log("위도:", lat, "경도:", lon);

    //주소, 위도, 경도 회원테이블에 업데이트하기

    //메인 페이지로 리다이렉트
  };
  
  const conversionAddr = async (addr: string) => {
    return new Promise<{ lat: number, lon: number }>((resolve, reject) => {
      kakao.maps.load(function () {
        const geocoder = new kakao.maps.services.Geocoder();
  
        const callback = function (result: any, status: any) {
          if (status === kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lon = result[0].x;
            resolve({ lat, lon });
          } else {
            reject('Failed to find address');
          }
        };
  
        geocoder.addressSearch(addr, callback);
      });
    });
  };

  return (
    <div className="w-full max-w-screen-md p-4 space-y-4 animate-fade-in">
      {/* 카드 컴포넌트 */}
      <Card className="max-w-screen-md">
        <CardHeader>
          <CardTitle>주소 입력</CardTitle>
          <CardDescription>주소를 검색하여 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">주소</Label>
              <Button variant="outline" onClick={() => setIsPopupOpen(true)}>
                주소 검색
              </Button>
              <Input
                id="address"
                value={address}
                readOnly
                placeholder="주소 검색을 해주세요"
              />
              <Button variant="outline" className="w-auto" onClick={updateAddr}>
                확인
              </Button>
            </div>
            {/* Daum Postcode 팝업 */}
            {isPopupOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
                  <DaumPostcode onComplete={handleComplete} />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    닫기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center items-center">
            <Link
              className="text-center text-blue-500"
              href="http://localhost:3000/main"
            >
              다음에 할래요
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomePage;
