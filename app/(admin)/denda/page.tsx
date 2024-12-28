import TableDenda from "@/app/components/TableDenda";

interface PageProps {}

const Page = ({}: PageProps) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold font-source-sans text-[#465b65]">
          Assalamu'alaikum wr wb., Ustadzah Fulanah, S. Pd., M. Pd.,
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,_auto)] gap-5">
        <div className="order-1 col-span-1 p-6 bg-white-custom rounded-lg border-2 border-dark-gray lg:order-none lg:row-span-2 sm:col-span-2 lg:col-span-3">
          <h1 className="font-source-sans text-2xl text-primary font-bold">
            Statistik Kelas
          </h1>
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2 rounded-lg overflow-hidden border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1"></div>
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
            <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
              Daftar Denda
            </h2>

            <div className="flex gap-2"></div>
          </div>
          {/* <div className="rounded-lg overflow-hidden md:border-black-custom border"> */}
          <TableDenda />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default Page;
