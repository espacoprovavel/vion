/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // O repositório tem outro lockfile na raiz (a app Expo); fixamos a raiz aqui.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
