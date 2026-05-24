/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Ensure GSAP plugins resolve correctly
  transpilePackages: ['gsap'],
};

export default nextConfig;
