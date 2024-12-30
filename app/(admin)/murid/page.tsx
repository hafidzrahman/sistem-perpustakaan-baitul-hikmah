"use client";

import BtnSecondary from "@/app/components/BtnSecondary";
import CardLeaderboardMurid from "@/app/components/CardLeaderboardMurid";
import BarChartMurid from "@/app/components/charts/BarChartMurid";
import TableMurid from "@/app/components/TableMurid";
import { AddCircleHalfDotIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import ModalTambahKelas from "@/app/components/modal/ModalTambahKelas";
import ModalTambahMurid from "@/app/components/modal/ModalTambahMurid";

interface MuridPageProps {
  onclick: () => void;
}

interface LeaderboardEntry {
  nis: string;
  nama: string;
  kelas: string;
  booksRead: number;
}

const MuridPage = ({}: MuridPageProps) => {
  const [murid, setMurid] = useState();
  const [addClass, setTambahKelas] = useState(false);
  const [tambahMurid, setTambahMurid] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );

  const handleTambahKelas = () => {
    setTambahKelas(!addClass);
  };
  const handleTambahMurid = () => {
    setTambahMurid(!tambahMurid);
  };

  useEffect(() => {
    const fetchMurid = async () => {
      const respon = await fetch("/api/murid");
      const data = await respon.json();
      console.log(data);
      setMurid(data);
    };
    fetchMurid();
  }, [tambahMurid]);

  useEffect(() => {
    const fetchKelas = async () => {
      const respon = await fetch("/api/murid");
      const data = await respon.json();
      setMurid(data);
    };
    fetchKelas();
  }, [addClass]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("/api/form-bukti");
        if (!response.ok) throw new Error("Failed to fetch leaderboard data");
        const data = await response.json();

        // Process data to create leaderboard
        const studentReadCounts = data.reduce(
          (acc: { [key: string]: LeaderboardEntry }, curr: any) => {
            const { murid } = curr;
            const muridNIS = murid.nis; // Get NIS directly from murid object

            // Get the current class info
            const currentClass = murid.riwayatKelas[0]?.kelas;
            const classInfo = currentClass
              ? `${currentClass.tingkat}-${currentClass.nama}`
              : "";

            // Only count approved submissions (status === true)
            if (curr.status === true) {
              if (!acc[muridNIS]) {
                acc[muridNIS] = {
                  nis: muridNIS,
                  nama: murid.nama,
                  kelas: classInfo,
                  booksRead: 1,
                };
              } else {
                acc[muridNIS].booksRead += 1;
              }
            } else if (!acc[muridNIS]) {
              // Initialize student even if they have no approved submissions
              acc[muridNIS] = {
                nis: muridNIS,
                nama: murid.nama,
                kelas: classInfo,
                booksRead: 0,
              };
            }

            return acc;
          },
          {}
        );

        // Convert to array and sort by books read
        const leaderboard = Object.values(studentReadCounts)
          .sort((a, b) => {
            // Sort by books read (descending)
            const booksComparison = b.booksRead - a.booksRead;
            // If books read are equal, sort alphabetically by name
            if (booksComparison === 0) {
              return a.nama.localeCompare(b.nama);
            }
            return booksComparison;
          })
          .slice(0, 3); // Get top 3

        console.log("Processed leaderboard data:", leaderboard); // For debugging
        setLeaderboardData(leaderboard);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message);
      }
    };
    fetchLeaderboardData();
  }, []);

  return (
    <>
      <ModalTambahKelas status={addClass} handle={handleTambahKelas} />
      <ModalTambahMurid status={tambahMurid} handle={handleTambahMurid} />
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
          <BarChartMurid />
        </div>

        <div className="relative order-4 col-span-1 p-6 bg-white border-2 rounded-lg overflow-hidden border-dark-gray sm:col-span-2 lg:row-span-2 lg:order-none lg:col-span-1">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Papan Peringkat
          </h1>
          <div className="flex flex-col max-h-96 my-4 gap-2 overflow-y-auto">
            {leaderboardData.map((student, index) => (
              <CardLeaderboardMurid
                key={index}
                name={student.nama}
                kelas={student.kelas}
                booksRead={student.booksRead}
                totalBooksToRead={20}
                rank={index}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 order-last col-span-1 row-span-2 p-6 bg-white  rounded-lg border-2 border-dark-gray lg:order-none sm:col-span-2 lg:col-span-4 lg:row-span-2 dark-gray">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-0 sm:justify-between sm:items-center mb-4">
            <h2 className="font-source-sans md:text-2xl text-xl text-primary font-bold">
              Daftar Murid
            </h2>

            <div className="flex gap-2">
              <BtnSecondary
                label="Tambah Kelas"
                icon={AddCircleHalfDotIcon}
                onClick={handleTambahKelas}
              />
              <BtnSecondary
                label="Tambah Murid"
                icon={AddCircleHalfDotIcon}
                onClick={handleTambahMurid}
              />
            </div>
          </div>
          {/* <div className="rounded-lg overflow-hidden md:border-black-custom border"> */}
          <TableMurid data={murid} />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default MuridPage;
