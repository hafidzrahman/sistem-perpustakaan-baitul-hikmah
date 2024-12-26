"use client";
import BerandaAdmin from "@/app/components/beranda/BerandaAdmin";
import BerandaMurid from "@/app/components/beranda/BerandaMurid";
import { useSession } from "next-auth/react";

export default function PanelKontrolPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session?.user?.role === "murid") {
    return <BerandaMurid />;
  }

  return <BerandaAdmin />;
}
