import { NextResponse } from 'next/server';

export function middleware(request) {
  // console.log("모든 경로에 대해 얘가 뜨니?");

  // const { pathName}  = request.nextUrl;
  // // console.log(pathName);
  // if(pathName === "/auth/login" || pathName ==="/auth/signup"){
  //   console.log("제외된 경로로 요청");
  //   return NextResponse.next();
  // }

  // //토큰 확인
  // const token = request.cookies.get('jwtToken');

  // if(!token){
  //   console.log("토큰이 없음 로그인 페이지로 리디렉션");
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // } 
  // else{
  //   console.log("쿠키에서 가져온 JWT 토큰:" ,token);
  // }

  // return NextResponse.next();
}