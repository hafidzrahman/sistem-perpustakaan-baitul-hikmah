"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  icon: React.ElementType;
  href: string;
  label: string;
  sidebar: boolean;
}

const SidebarLink = ({
  icon: Icon,
  href,
  label,
  sidebar,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`w-full flex font-extralight items-center gap-2 py-4 border-b-2 transition-all duration-300 ease-in-out font-source-sans
    ${
      isActive
        ? "text-yellow-custom text-sm border-yellow-custom"
        : "text-white-custom text-xs border-white-custom"
    }
    hover:text-yellow-custom hover:text-sm hover:border-yellow-custom
    ${sidebar ? "" : "justify-center"}
  `}
    >
      <Icon
        width={20}
        height={20}
        className="transition-transform duration-300 ease-in-out"
      />
      <p
        className={`transition-opacity duration-300 ease-in-out ${
          sidebar ? "inline opacity-100" : "hidden opacity-0"
        }`}
      >
        {label}
      </p>
    </Link>
  );
};

export default SidebarLink;
