import { checkKor, checkLength } from "./Regex";

export const nameValidation = (
  value: string,
  setIsNameValid: (isValid: boolean) => void,
  setNameValidMessage: (message: string) => void
) => {
  value = value.replace(/[<>]/g, "").trim();

  if (checkLength(value, 2, 12) === false) {
    setIsNameValid(false);
    setNameValidMessage("2글자 이상 12글자 이하만 가능합니다");
  } else if (checkKor(value) === false) {
    setIsNameValid(false);
    setNameValidMessage("한글만 입력 가능합니다");
  } else {
    setIsNameValid(true);
    setNameValidMessage("사용 가능");
  }
};
