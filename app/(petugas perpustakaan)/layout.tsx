"use client";

//  ⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.

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
} from "hugeicons-react";
import SidebarLink from "../components/SidebarLink";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLabel, setActiveLabel] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#FFF]">
      {/* Sidebar */}
      <div
        className={`bg-dark gap-8 relative flex flex-col top-0 h-screen transition-width border-r-2 border-black-custom duration-300 ${
          isSidebarOpen ? "w-60" : "w-20"
        }`}
      >
        <div className="w-full flex justify-between items-center px-4 py-2">
          <h1
            className={` ${
              isSidebarOpen ? "block" : "hidden"
            } ml-4 text-2xl font-source-serif font-bold text-white-custom`}
          >
            Al-Fityah
          </h1>
          {isSidebarOpen ? (
            <button
              onClick={toggleSidebar}
              className="p-2 right-4 top-4 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <SquareArrowShrink02Icon
                width={40}
                height={40}
                color="#FFF"
                strokeWidth={0}
              />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="py-2 px-0.5 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <SquareArrowExpand01Icon
                width={40}
                height={40}
                color="#FFF"
                strokeWidth={0}
              />
            </button>
          )}
        </div>

        {/* Konten sidebar */}
        <ul
          className={`flex items-center gap-2 justify-center flex-col ${
            isSidebarOpen ? "px-8" : "px-4"
          }`}
        >
          <SidebarLink
            icon={DashboardSquare02Icon}
            href="/panel-kontrol"
            label="Panel Kontrol"
            sidebar={isSidebarOpen}
            onLabel={setActiveLabel}
          />
          <SidebarLink
            icon={BookOpen02Icon}
            href="/buku"
            label="Buku"
            sidebar={isSidebarOpen}
            onLabel={setActiveLabel}
          />
          <SidebarLink
            icon={Mortarboard01Icon}
            href="/murid"
            label="Murid"
            sidebar={isSidebarOpen}
            onLabel={setActiveLabel}
          />
          <SidebarLink
            icon={TeacherIcon}
            href="/guru"
            label="Guru"
            sidebar={isSidebarOpen}
            onLabel={setActiveLabel}
          />
          <SidebarLink
            icon={ChartLineData03Icon}
            href="/laporan"
            label="Laporan"
            sidebar={isSidebarOpen}
            onLabel={setActiveLabel}
          />
        </ul>
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex w-full py-4 items-center justify-between sticky bg-white border-b-2 border-black-custom z-10 px-6 mx-auto top-0 right-0 left-0">
          <h1 className="mb-2 text-3xl font-extrabold font-source-serif sm:text-3xl text-light-primary">
            {activeLabel}
          </h1>
          <div className="flex items-center gap-3 justify-center">
            <div className="flex flex-col items-end justify-center">
              <h1 className="text-lg font-source-serif leading-none font-bold">
                Ustadzah Fulanah, S. Pd., M. Pd
              </h1>
              <h2 className="text-xs ml-0.5 font-source-sans leading-none ">
                Petugas Perpustakaan
              </h2>
            </div>
            <UserCircleIcon width={40} height={40} />
          </div>
        </header>

        {/* Konten utama yang bisa di-scroll */}
        <main className="flex-grow bg-white-custom p-4 bg-noise bg-repeat">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
