"use client";
import React from "react";
import LayoutAdmin from "@/app/components/layout/LayoutAdmin";
import LayoutMurid from "@/app/components/layout/LayoutMurid";
import { SessionProvider, useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  console.log(session?.user?.role);
  console.log(session?.user?.name);
  console.log(session)

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
      <LayoutWrapper>
        <>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {children}
        </>
      </LayoutWrapper>
    </SessionProvider>
  );
};

export default Layout;
