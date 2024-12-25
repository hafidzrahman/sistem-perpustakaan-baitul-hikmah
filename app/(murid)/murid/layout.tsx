"use client";

import React from "react";
import LayoutAdmin from "@/app/components/layout/LayoutAdmin";
import LayoutMurid from "@/app/components/layout/LayoutMurid";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const role = "murid";

  if (role === "murid") {
    return <LayoutAdmin children={children} />;
  } else if (role === "admin") {
    return <LayoutMurid children={children} />;
  }
};

export default Layout;
