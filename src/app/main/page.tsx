"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import PWAInstallButton from "@/components/layout/PwaInstallBtn";
import Sidemenu from "@/components/layout/Sidemenu";
import Link from "next/link";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { CurrentLocationMap } from "@/components/map/CurrentLocationMap";
import { useEffect, useState } from "react";
import AnimatedCards from "@/components/layout/AnimatedCards";
import { verifiRefreshToken } from "@/api/auth";
import AddressChangePopup from "@/components/auth/AddressChangePopup";
import { getDetailProfile } from "@/api/user";

export default function Page() {
  const [addressPopupOpen, setAddressPopUpOpen] = useState(false);

  useEffect(() => {
    /**
     * access, refresh 토큰 저장
     */
    const fetchData = async () => {
      console.log("access토큰이 localStorage에 없습니다 access 토큰을 생성을 시도합니다");
      try {
        const response = await verifiRefreshToken();
        const accessToken = response.headers["oauth2access"].split("Bearer ")[1];

        localStorage.setItem("access", accessToken);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("access 토큰의 재발급을 실패했습니다");
      }
    };

    /**
     * 주소 등록했는지 확인
     */
    const createAddressCondition = async () => {
      try {
        const response = await getDetailProfile();
        // console.log("lat : " + response.latitude + "lon" + response.longitude);

        if (response.latitude && response.longitude) {
          localStorage.setItem("address-popup", "0");
          setAddressPopUpOpen(false);
        }
        else {
          localStorage.setItem("address-popup", "1");
          setAddressPopUpOpen(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    /**
     * 주소 팝업 확인
     */
    const localStorageAddress = localStorage.getItem("address-popup");
    if (localStorageAddress === null) { //로컬스토리지가 아예 없음
      createAddressCondition();
    } else {
      if (localStorageAddress === "0") {
        //팝업을 열지않겠다
        setAddressPopUpOpen(false);
      }
      else if (localStorageAddress === "1") {
        //팝업을 열겠다
        setAddressPopUpOpen(true);
      }
    }

    if (localStorage.getItem("access") === null) {
      fetchData();
    }

  }, []);

  return (
    <div className="w-full animate-fade-in flex flex-col bg-white dark:bg-gray-900 pb-20">
      <div className="flex flex-row justify-between mb-8">
        <h2 className="font-sebang text-3xl font-semibold text-purple-800 dark:text-purple-400">
          길따라
        </h2>
        <DarkModeToggle />
        <Sidemenu />
      </div>

      <Card className="flex items-center flex-col p-4 bg-white dark:bg-gray-800">
        <CardContent className="w-full px-0">
          <CurrentLocationMap width="w-full" height="h-48" />
        </CardContent>
        <div className="w-full flex flex-row justify-between">
          <h2 className="text-gray-900 dark:text-white">
            지금 경로 녹화 하러가기
          </h2>
          <Link href="/record">
            <Pencil className="cursor-pointer hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
          </Link>
        </div>
      </Card>

      <Separator className="my-4 dark:bg-gray-700" />

      <PWAInstallButton />

      {addressPopupOpen && <AddressChangePopup />}
      <AnimatedCards />
    </div>
  );
}
