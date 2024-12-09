
/**
 * 토큰, 로컬스토리지 삭제
 */
export const tokenClean = ()=>{
  //localStorage
  // console.log("localStorage에 있는 것들을 삭제합니다");
  localStorage.removeItem("access");
  localStorage.removeItem("address-popup");
}