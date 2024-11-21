import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // 개발 모드에서도 PWA 활성화
  runtimeCaching: [],
  buildExcludes: [/middleware-manifest\.json$/],
  additionalManifestEntries: [
    {
      url: "/worker/location-worker.js",
      revision: "1",
    },
  ],
  ...nextConfig,
});
