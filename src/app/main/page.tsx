"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Footprints, PlusSquare, Share } from "lucide-react";
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [addressPopupOpen, setAddressPopUpOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone;

    const checkIOSDevice = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const hasShownIOSGuide = localStorage.getItem('ios-pwa-guide-shown');

      if (isIOS && !isStandalone && !hasShownIOSGuide) {
        setShowIOSModal(true);
        localStorage.setItem('ios-pwa-guide-shown', 'true');
      }
    };

    /**
     * access, refresh 토큰 저장
     */
    const fetchData = async () => {
      console.log("access토큰이 localStorage에 없습니다 access 토큰을 생성을 시도합니다");
      try {
        const response = await verifiRefreshToken();
        const accessToken = response.headers["oauth2access"].split("Bearer ")[1];

        localStorage.setItem("access", accessToken);
        window.location.reload();
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
        console.log("lat : " + response.latitude + " / lon : " + response.longitude);

        if (response.latitude && response.longitude) {
          localStorage.setItem("address-popup", "0");
          setAddressPopUpOpen(false);
        } else {
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
    if (localStorageAddress === null) {
      //로컬스토리지가 아예 없음
      createAddressCondition();
    } else {
      if (localStorageAddress === "0") {
        //팝업을 열지않겠다
        setAddressPopUpOpen(false);
      } else if (localStorageAddress === "1") {
        //팝업을 열겠다
        setAddressPopUpOpen(true);
      }
    }

    if (localStorage.getItem("access") === null) {
      fetchData();
    }

    checkIOSDevice();

  }, []);

  return (
    <div className="w-full animate-fade-in flex flex-col bg-white dark:bg-gray-900 pb-20">
      <div className="flex flex-row justify-between mb-8">
        <h2 className="font-sebang text-3xl font-semibold text-purple-800 dark:text-purple-400">길따라</h2>
        <DarkModeToggle />
        <Sidemenu />
      </div>

      <Card className="flex items-center flex-col p-4 bg-white dark:bg-gray-800">
        <CardContent className="w-full px-0">
          <CurrentLocationMap width="w-full" height="h-48" />
        </CardContent>
        <div className="w-full flex flex-row justify-between">
          <h2 className="text-gray-900 dark:text-white">지금 경로 녹화 하러가기</h2>
          <Link href="/record">
            <Footprints className="cursor-pointer hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
          </Link>
        </div>
      </Card>

      <Separator className="my-4 dark:bg-gray-700" />

      <PWAInstallButton />
      <IOSInstallGuideModal
        isOpen={showIOSModal}
        setIsOpen={setShowIOSModal}
      />


      <AddressChangePopup props={{ isPopupOpen: addressPopupOpen, setIsPopupOpen: setAddressPopUpOpen, callback: () => { } }} isMypage={false} />
      <AnimatedCards />
    </div>
  );
}

const IOSInstallGuideModal = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>iOS에서 길따라 앱 설치하기</DialogTitle>
          <DialogDescription>
            더 나은 경험을 위해 길따라 앱을 설치해보세요!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Share className="w-5 h-5 text-blue-500" />
            <p>1. 하단의 "공유" 버튼을 눌러주세요</p>
          </div>
          <div className="flex items-center gap-2">
            <PlusSquare className="w-5 h-5 text-blue-500" />
            <p>2. "홈 화면에 추가" 를 선택해주세요</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              다음에 하기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};