"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight01Icon } from "hugeicons-react";

const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  // Fungsi untuk mengkapitalisasi huruf pertama
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Fungsi untuk format segment path
  const formatPathSegment = (segment: string) => {
    // Jika segment mengandung "-", ganti dengan spasi dan kapitalisasi setiap kata
    if (segment.includes("-")) {
      return segment.split("-").map(capitalizeFirstLetter).join(" ");
    }
    return capitalizeFirstLetter(segment);
  };

  return (
    <div className="flex items-center space-x-2">
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const formattedPath = formatPathSegment(path);

        return (
          <React.Fragment key={path}>
            {index > 0 && (
              <ArrowRight01Icon className="w-4 h-4 text-gray-text" />
            )}
            <div
              className={`${
                isLast
                  ? "text-light-primary font-bold"
                  : "text-gray-text hover:text-primary transition-colors"
              }`}
            >
              {isLast ? (
                formattedPath
              ) : (
                <Link href={href}>{formattedPath}</Link>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
