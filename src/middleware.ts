import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const PROTECTED_PATHS = ["/main", "/record"];
const AUTH_STATUS_COOKIE = "loginchecker";
const AUTH_PATH = "/auth";
const LOGIN_PAGE = "/auth/login";
const MAIN_PAGE = "/main";

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  const url = request.nextUrl.clone();
  console.log(url.pathname);
  // url.pathname = "/signin";
  // return NextResponse.redirect(url);

  const auth = request.cookies.has(AUTH_STATUS_COOKIE);
  console.log("auth = " + auth);
  // const auth = false;
  // document.cookie = `${AUTH_STATUS_COOKIE}`

  const response = NextResponse.next();
  // 쿠키 생성
  response.cookies.set(AUTH_STATUS_COOKIE, "", {
    path: "/", // 모든 경로에서 유효
    // maxAge: 60 * 60 * 24, // 1일 (초 단위)
    httpOnly: false, // 클라이언트에서 접근 가능
    secure: true, // HTTPS만 필요한 경우 true로 설정
    sameSite: "none", // SameSite 설정
  });

  // 로그인 된 상태 + 로그인 페이지로 진입
  if (auth && url.pathname.startsWith(AUTH_PATH)) {
    console.log("로그인된 상태입니다 메인페이지로 갑니다");
    return NextResponse.redirect(new URL(MAIN_PAGE, request.url));
  }

  // 로그인 안된 상태 + 로그인 페이지를 제외한 곳으로 진입
  if (!auth && !url.pathname.startsWith(AUTH_PATH)) {
    console.log("로그아웃된 상태입니다 로그인페이지로 진입합니다");
    return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
  }

  //테스트용
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // const isAuthenticated =
  //   request.cookies.get(AUTH_STATUS_COOKIE)?.value === "authenticated";

  // // 루트 경로 처리 수정
  // if (pathname === "/") {
  //   // 인증된 상태면 /main으로, 아니면 /auth/login으로
  //   return isAuthenticated
  //     ? NextResponse.redirect(new URL("/main", request.url))
  //     : NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // // 보호된 경로 체크
  // const isProtectedPath = PROTECTED_PATHS.some((path) =>
  //   pathname.startsWith(path)
  // );

  // // 인증이 필요한 경로에 미인증 상태로 접근할 경우
  // if (isProtectedPath && !isAuthenticated) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // // /record/save 경로에 대한 특별 처리
  // if (pathname === "/record/save") {
  //   const hasTempPath = request.cookies.get("has-temp-path")?.value === "true";

  //   if (!hasTempPath) {
  //     return NextResponse.redirect(new URL("/record", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/((?!_next/static|_next/image|favicon.ico|Resources|icons|manifest|\\.jpg$|\\.png$|\\.css$|\\.js$|\\.svg$|\\.webp$).*)',
    "/auth/:path*",
    "/follow/:path*",
    "/main/:path*",
    "/record/:path*",
    "/:path",
  ],
};
