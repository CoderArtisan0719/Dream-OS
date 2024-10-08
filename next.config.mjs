/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  // todo: find out why the hell image optimization isn't working in prod for local images
  // images: { domains: ["desktop-t.vercel.app", "coin-images.coingecko.com"], unoptimized: true },
  images: { unoptimized: true },
};

export default nextConfig;
