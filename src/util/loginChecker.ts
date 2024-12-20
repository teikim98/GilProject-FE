const AUTH_STATUS_COOKIE = "loginchecker";

/**
 * 페이지 처리용 쿠키 생성(브라우저 닫으면 삭제됨)
 */
export const loginCheckerTokenGenerator = () => {
  document.cookie = `${AUTH_STATUS_COOKIE}=; path=/;}`;

};

/**
 * 페이지 처리용 쿠키 삭제
 */
export const removeLoginChecker = ()=>{
  document.cookie = `${AUTH_STATUS_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
