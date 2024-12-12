import PeminjamanCalendar from "@/app/components/PeminjamanCalendar";

interface PageProps {}

const Page = ({}: PageProps) => {
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <PeminjamanCalendar />
    </div>
  );
};

export default Page;
