import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  AddCircleHalfDotIcon,
  BookOpen01Icon,
  Calendar01Icon,
  MapPinIcon,
  UserAccountIcon,
} from "hugeicons-react";
import { formBuktiType } from "@/lib";
import CardLeaderboardMurid from "../CardLeaderboardMurid";
import TableFormBukti from "../TableFormBukti";
import ModalFormBukti from "../modal/ModalFormBukti";
import BtnSecondary from "../BtnSecondary";
import TableFormBuktiMurid from "../TableFormBuktiMurid";

interface LeaderboardEntry {
  nis: string;
  nama: string;
  kelas: string;
  booksRead: number;
}

const FormBuktiMurid = () => {
  const [readingHistory, setReadingHistory] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [showFormBuktiModal, setShowFormBuktiModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.username) {
        try {
          const response = await fetch(
            `/api/form-bukti/murid/${session.user.username}`
          );
          if (!response.ok) throw new Error("Failed to fetch data");
          const data = await response.json();
          setReadingHistory(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

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

    fetchData();
    fetchLeaderboardData();
  }, [session?.user?.username, showFormBuktiModal]);

  const calculateProgress = (history: any) => {
    return (history.length / 20) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  console.log(readingHistory);
  console.log(leaderboardData);

  return (
    <>
      <ModalFormBukti
        status={showFormBuktiModal}
        handle={() => setShowFormBuktiModal(false)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        <div className="relative order-1 col-span-1 grid-cols-1 p-6 sm:col-span-2 lg:col-span-4 bg-white-custom rounded-lg border-2 border-dark-gray">
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

        {/* Reading History Table */}
        <div className="col-span-1 grid-cols-1 order-2 sm:col-span-2 lg:col-span-4 bg-white-custom rounded-lg border-2 border-dark-gray">
          <div className="p-6">
            <div className="flex items-center justify-between gap-2 mb-6">
              <h1 className="font-source-sans text-2xl text-left text-primary font-bold">
                Riwayat Form Bukti
              </h1>
              <BtnSecondary
                label="Ajukan Form Bukti"
                icon={AddCircleHalfDotIcon}
                onClick={() => setShowFormBuktiModal(!false)}
              />
            </div>

            <TableFormBuktiMurid data={readingHistory} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormBuktiMurid;
