import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//뒤로가기시 이벤트 막기
export const usePreventNavigation = (shouldPrevent: boolean) => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldPrevent) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setPendingRoute("back");
      setShowAlert(true);
      // history 상태 유지
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldPrevent]);

  const handleNavigate = () => {
    if (pendingRoute === "back") {
      router.back();
    }
    setShowAlert(false);
    setPendingRoute(null);
  };

  const handleCancel = () => {
    setShowAlert(false);
    setPendingRoute(null);
  };

  return {
    showAlert,
    handleNavigate,
    handleCancel,
  };
};
