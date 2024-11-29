import React, { useState, useEffect } from "react";
import ValidateMessage from './ValidateMessage';

/**
 * 타이머 컴포넌트
 * @param param0
 * @returns 
 */
const Timer = ({ initialTime, onComplete}: { initialTime: number, onComplete: () => void}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime); // 초기 시간
  const [isTimerCompleted, setIsTimerCompleted] = useState(false); // 타이머 완료 여부

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60); // 분
    const seconds = time % 60; // 초

    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if(isTimerCompleted) return;

    if(timeLeft <= 0){
      setIsTimerCompleted(true);
      onComplete();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [timeLeft]);

  return (
    <div>
      <ValidateMessage validCondition={false} message={formatTime(timeLeft)} />
    </div>
  );
};

export default Timer;
