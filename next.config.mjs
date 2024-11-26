import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: false,
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development" ? false : false, // 개발 환경에서도 PWA 활성화
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  additionalManifestEntries: [
    {
      url: "/worker/location-worker.js",
      revision: "1",
    },
  ],
};

export default withPWA(pwaConfig)(nextConfig);
