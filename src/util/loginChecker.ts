const AUTH_STATUS_COOKIE = "loginchecker";

/**
 * 페이지 처리용 쿠키 생성(브라우저 닫으면 삭제됨)
 */
export const loginCheckerTokenGenerator = () => {
  // const futureDate = new Date();
  // futureDate.setFullYear(futureDate.getFullYear() + 100); // 100년 후로 설정
  // document.cookie = `loginchecker=; path=/; expires=${futureDate.toUTCString()}`;
  document.cookie = `${AUTH_STATUS_COOKIE}=; path=/;}`;

};

/**
 * 페이지 처리용 쿠키 삭제
 */
export const removeLoginChecker = ()=>{
  document.cookie = `${AUTH_STATUS_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  // document.cookie = `${AUTH_STATUS_COOKIE}=; path=/; domain=gil-project.kro.kr; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}
