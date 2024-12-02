"use client";

import { useEffect, useState } from "react";

export const preventRefreshAndBack = () => {
  // let router = useRouter();
  const [allowNavigation, setAllowNavigation] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (!allowNavigation) {
        const message =
          "페이지를 떠나면 변경사항이 저장되지 않을 수 있습니다. 정말 떠나시겠습니까?";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    const handlePopState = () => {
      if (!allowNavigation) {
        const confirmLeave = window.confirm(
          "뒤로가기 시 페이지 내용은 저장되지 않습니다. 이동하시겠습니까?"
        );
        if (confirmLeave) {
          setAllowNavigation(true); // 뒤로가기를 허용
          window.history.back(); // 실제 뒤로가기 동작 수행
        } else {
          // 상태 복구
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // 초기 상태를 히스토리에 추가
    window.history.pushState(null, "", window.location.href);

    return () => {
      // 이벤트 리스너 해제
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [allowNavigation]);
};
