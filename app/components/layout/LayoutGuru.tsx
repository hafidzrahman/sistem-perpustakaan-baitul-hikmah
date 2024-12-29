"use client";

import React, { useState } from "react";
import {
  UserCircleIcon,
  DashboardSquare02Icon,
  BookOpen02Icon,
  ChartLineData03Icon,
  Mortarboard01Icon,
  TeacherIcon,
  SquareArrowExpand01Icon,
  SquareArrowShrink02Icon,
  Menu01Icon,
  LicenseDraftIcon,
} from "hugeicons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarLink from "../SidebarLink";
import Breadcrumb from "../Breadcrumbs";
import { useSession } from "next-auth/react";

const LayoutGuru = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { data: session } = useSession();

  const navigation = [
    {
      icon: DashboardSquare02Icon,
      href: "/panel-kontrol",
      label: "Panel Kontrol",
    },
    { icon: BookOpen02Icon, href: "/buku", label: "Buku" },
  ];

  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex bg-dark gap-8 relative flex-col h-screen transition-width border-r-2 border-black-custom duration-300 ${
          isSidebarOpen ? "w-60" : "w-20"
        }`}
      >
        <div className="w-full flex justify-between items-center px-4 py-2">
          <h1
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } ml-4 text-2xl font-source-serif font-bold text-white-custom`}
          >
            Al-Fityah
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isSidebarOpen ? (
              <SquareArrowShrink02Icon
                width={40}
                height={40}
                color="#FFF"
                strokeWidth={0}
              />
            ) : (
              <SquareArrowExpand01Icon
                width={40}
                height={40}
                color="#FFF"
                strokeWidth={0}
              />
            )}
          </button>
        </div>

        <ul
          className={`flex items-center gap-2 justify-center flex-col ${
            isSidebarOpen ? "px-8" : "px-4"
          }`}
        >
          {navigation.map((item) => (
            <SidebarLink
              key={item.href}
              icon={item.icon}
              href={item.href}
              label={item.label}
              sidebar={isSidebarOpen}
            />
          ))}
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-dark transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-source-serif font-bold text-white-custom">
            Al-Fityah
          </h1>
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 font-black"
          >
            X
          </button>
        </div>
        <ul className="px-8 py-2 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href; // Periksa apakah link aktif
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex font-extralight items-center gap-2 py-4 border-b-2 transition-all duration-300 ease-in-out font-source-sans ${
                  isActive
                    ? "text-yellow-custom text-sm border-yellow-custom"
                    : "text-white-custom text-xs border-white-custom"
                }`}
              >
                <item.icon width={24} height={24} />
                <span className="font-source-sans">{item.label}</span>
              </Link>
            );
          })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex w-full py-4 items-center justify-between sticky bg-white border-b-2 border-black-custom z-30 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={toggleMobileMenu}
            >
              <Menu01Icon width={24} height={24} />
            </button>
            <Breadcrumb />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end justify-center">
              <h1 className="text-sm sm:text-lg font-source-serif leading-none font-bold truncate">
                {session?.user?.name}
              </h1>
              <h2 className="text-xs font-source-sans leading-none">Guru</h2>
            </div>
            <UserCircleIcon
              width={32}
              height={32}
              className="sm:w-10 sm:h-10"
            />
          </div>
        </header>

        <main className="flex-grow overflow-y-auto bg-[#F5F5DC] p-4 bg-noise bg-repeat">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutGuru;
