import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // 개발 모드에서도 PWA 활성화
  ...nextConfig,
});
