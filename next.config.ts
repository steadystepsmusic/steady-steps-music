import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  // Retired payment URLs that students may still have saved
  async redirects() {
    return [
      { source: '/pay/block', destination: '/pay/block-2hr', permanent: true },
      { source: '/pay/inhome', destination: '/pay?location=inhome', permanent: true },
      { source: '/pay/inhome-prepay', destination: '/pay?location=inhome&plan=monthly', permanent: true },
      // 7th chords sheet was a free download before it went paid
      { source: '/yt-7th-chords-x7q2', destination: '/7th-chords', permanent: false },
      { source: '/downloads/ssm-7th-chords-x7q2mn.pdf', destination: '/7th-chords', permanent: false },
    ];
  },
};

export default nextConfig;
