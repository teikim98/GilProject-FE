//유효성 검사///////////////////////////////////////

/**
 * 글자수 검사
 * @param min 최소 글자수
 * @param max 최대 글자수
 */
export function checkLength(message:string,min: number, max : number) : boolean {
  const regex = new RegExp(`^.{${min},${max}}$`); // min과 max를 동적으로 반영
  return regex.test(message); // 조건에 맞는지 검사
}

/**
 * 한글 또는 영어 검사
 */
export function checkKorOrEng(message : string) : boolean{
  const regex = new RegExp(`^[가-힣a-zA-Z]+$`);

  return regex.test(message);
}

/**
 * 한글 검사
 * @param message 
 * @returns 
 */
export function checkKor(message : string) : boolean{
  const regex = new RegExp(`^[가-힣]+$`);

  return regex.test(message);
}

/**
 * 한글,영어,숫자 검사
 * @param message 
 * @returns 
 */
export function checkKorOrEngOrNum(message : string) :boolean{
  const regex = new RegExp(`^[가-힣a-zA-Z0-9_]+$`);

  return regex.test(message);
}

/**
 * 이메일 검사
 * @param email 
 * @returns 
 */
export function checkEmailForm(email : string) : boolean{
  const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`);

  return regex.test(email);
}

