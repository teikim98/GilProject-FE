"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import PWAInstallButton from "@/components/layout/PwaInstallBtn";
import Sidemenu from "@/components/layout/Sidemenu";
import Link from "next/link";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { CurrentLocationMap } from "@/components/map/CurrentLocationMap";
import { useEffect } from "react";
import { verifiRefreshToken } from "@/api/auth";
import AddressChangePopup from "@/components/auth/AddressChangePopup";
import AnimatedCards from "@/components/layout/AnimatedCards";

export default function Page() {
  // 소셜로그인할때 access, refresh 토큰 저장
  useEffect(() => {
    const fetchData = async () => {
      console.log("refresh 토큰을 백엔드에서 인증");
      try {
        const response = await verifiRefreshToken();

        const accessToken = response.headers["oauth2access"].split("Bearer ")[1];

        localStorage.setItem("access", accessToken);
        console.log("Access Token 저장 완료:", accessToken);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (localStorage.getItem("access") === null) {
      fetchData();
    }
  }, []); // 의존성 배열 추가

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

      <Link href="/test" className="text-lg font-semibold">
        경로 따라가기 테스트하기
      </Link>

      <Separator className="my-4 dark:bg-gray-700" />

      <PWAInstallButton />

      <AddressChangePopup />
      <AnimatedCards />
    </div>
  );
}
