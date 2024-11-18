import CardData from "@/app/components/CardData";
import {
  Mortarboard01Icon,
  TeacherIcon,
  BookOpen02Icon,
  Agreement02Icon,
} from "hugeicons-react";

interface PageProps {}

const Page = ({}: PageProps) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd.,
        </h2>
      </div>
      <div className="flex justify-between gap-4 mb-4">
        <CardData number="791" label="Murid" icon={Mortarboard01Icon} />
        <CardData number="048" label="Guru" icon={TeacherIcon} />
        <CardData number="794" label="Buku" icon={BookOpen02Icon} />
        <CardData number="303" label="Peminjaman" icon={Agreement02Icon} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom  rounded-lg border-2 border-border-gray lg:order-none lg:row-span-2 border-gray sm:col-span-2 lg:col-span-3">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Ikhtisar
          </h1>
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2  rounded-lg border-border-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Status Buku
          </h1>
        </div>
        <div className="flex flex-col max-h-[380px] order-last col-span-1 row-span-2 p-6 overflow-y-auto bg-white  rounded-lg border-2 border-border-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 border-gray">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Riwayat Peminjaman
          </h1>
        </div>
      </div>
    </>
  );
};

export default Page;
