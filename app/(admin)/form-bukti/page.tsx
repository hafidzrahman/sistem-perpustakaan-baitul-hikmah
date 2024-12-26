"use client";
import FormBuktiAdmin from "@/app/components/form-bukti/FormBuktiAdmin";
import FormBuktiMurid from "@/app/components/form-bukti/FormBuktiMurid";
import { useSession } from "next-auth/react";

export default function FormBuktiPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session?.user?.role === "murid") {
    return <FormBuktiMurid />;
  }

  return <FormBuktiAdmin />;
}
