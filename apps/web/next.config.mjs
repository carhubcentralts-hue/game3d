/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@video-studio/shared',
    '@video-studio/video-core',
    '@video-studio/prompt-engine',
  ],
};

export default nextConfig;
