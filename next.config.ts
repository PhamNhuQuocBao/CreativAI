import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true, // Sử dụng true cho chuyển hướng vĩnh viễn (308), false cho tạm thời (307)
      },
    ];
  },
};

export default nextConfig;
