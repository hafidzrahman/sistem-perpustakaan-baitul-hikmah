import { useRouter } from "next/navigation";

interface PageProps {}

const Page = ({}: PageProps) => {
  const router = useRouter();

  router.push("/login")
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <h1 className="text-3xl font-black">Ini Landing Page</h1>
    </div>
  );
};

export default Page;
