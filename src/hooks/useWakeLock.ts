import { WakeLockSentinel } from "@/types/wake-lock";
import { useState, useEffect } from "react";

interface WakeLockHook {
  isSupported: boolean;
  isEnabled: boolean;
  enable: () => Promise<void>;
  disable: () => void;
  error: string | null;
}

const useWakeLock = (): WakeLockHook => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // 브라우저 지원 여부 확인
    setIsSupported(
      "wakeLock" in navigator && "request" in (navigator.wakeLock ?? {})
    );
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isEnabled) {
        try {
          await enable();
        } catch (err) {
          setError("Wake Lock 재활성화 실패");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isEnabled]);

  const enable = async () => {
    if (!isSupported) {
      setError("이 브라우저는 Wake Lock API를 지원하지 않습니다");
      return;
    }

    try {
      const wakeLockSentinel = await navigator.wakeLock.request("screen");
      setWakeLock(wakeLockSentinel);
      setIsEnabled(true);
      setError(null);
    } catch (err) {
      setError("Wake Lock 활성화 실패");
      setIsEnabled(false);
    }
  };

  const disable = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      setIsEnabled(false);
    }
  };

  return {
    isSupported,
    isEnabled,
    enable,
    disable,
    error,
  };
};

export default useWakeLock;
