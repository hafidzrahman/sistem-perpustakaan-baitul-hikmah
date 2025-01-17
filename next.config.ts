import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint : {
    ignoreDuringBuilds : true
  },
  images: {
    domains: [
      "books.google.co.id",
      "gpu.id",
      "ebooks.gramedia.com",
      "s3-ap-southeast-1.amazonaws.com",
      "image.gramedia.net",
      "example.com",
      "images-na.ssl-images-amazon.com",
      "www.gramedia.com",
      "cdn.gramedia.com",
      "drive.google.com",
      "test.com"
    ],
  },
};

export default nextConfig;
