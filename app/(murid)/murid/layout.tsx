"use client";

import React from "react";
import LayoutAdmin from "@/app/components/layout/LayoutAdmin";
import LayoutMurid from "@/app/components/layout/LayoutMurid";
import { SessionProvider } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  let layout = LayoutAdmin;

  const role = "murid";

  if (role === "murid") {
    layout = LayoutMurid;
  }

  return (
    <SessionProvider>
      <Layout children={children} />
    </SessionProvider>
  );
};

export default Layout;
