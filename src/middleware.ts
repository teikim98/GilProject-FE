import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/main", "/record"];
const AUTH_STATUS_COOKIE = "auth-status";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 루트 경로 처리
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. 인증 상태 확인
  const isAuthenticated =
    request.cookies.get(AUTH_STATUS_COOKIE)?.value === "authenticated";

  // 3. 보호된 경로 체크
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // 4. 인증이 필요한 경로에 미인증 상태로 접근할 경우
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 5. /record/save 경로에 대한 특별 처리
  if (pathname === "/record/save") {
    const hasTempPath = request.cookies.get("has-temp-path")?.value === "true";

    if (!hasTempPath) {
      return NextResponse.redirect(new URL("/record", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
