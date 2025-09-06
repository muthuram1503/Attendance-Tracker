const nextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_KINDE_ISSUER_URL: process.env.NEXT_PUBLIC_KINDE_ISSUER_URL,
  },

  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;

