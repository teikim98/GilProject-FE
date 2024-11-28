import React from "react";

/**
 * 유효성 체크에 따른 초록색, 빨간 메세지
 * @param props 
 * @returns 
 */
const ValidateMessage = (props: { validCondition: boolean, message: string }) => {
  const {validCondition, message} = props;

  return (
    <p
      className={`text-sm mt-1 ${
        validCondition === true
          ? "text-green-500"
          : "text-red-500"
      }`}
      // style={{ whiteSpace: "pre-line" }} // 줄 바꿈 적용
    >
      {message}
    </p>
  );
};

export default ValidateMessage;
