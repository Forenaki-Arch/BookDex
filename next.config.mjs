/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "http", hostname: "books.google.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
    ],
  },
  async headers() {
    return [
      {
        // Header di sicurezza di base applicati a tutte le rotte
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            // Consente l'uso della fotocamera (scanner ISBN) solo sulla stessa origine
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
