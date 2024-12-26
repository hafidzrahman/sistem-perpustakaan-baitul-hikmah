"use client";
import React from "react";
import LayoutAdmin from "@/app/components/layout/LayoutAdmin";
import LayoutMurid from "@/app/components/layout/LayoutMurid";
import { SessionProvider, useSession } from "next-auth/react";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  console.log(session?.user?.role);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const Layout = session?.user?.role === "murid" ? LayoutMurid : LayoutAdmin;

  return <Layout>{children}</Layout>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </SessionProvider>
  );
};

export default Layout;
