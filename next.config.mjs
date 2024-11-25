import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: false,
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  runtimeCaching: [],
  buildExcludes: [/middleware-manifest\.json$/],
  additionalManifestEntries: [
    {
      url: "/worker/location-worker.js",
      revision: "1",
    },
  ],
};

export default withPWA(pwaConfig)(nextConfig);
