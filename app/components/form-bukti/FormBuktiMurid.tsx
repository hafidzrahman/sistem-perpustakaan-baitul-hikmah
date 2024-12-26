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

const FormBuktiMurid = () => {
  const [readingHistory, setReadingHistory] = useState([]);
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

    fetchData();
  }, [session?.user?.username]);

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

  return (
    <>
      <ModalFormBukti
        status={showFormBuktiModal}
        handle={() => setShowFormBuktiModal(false)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        {/* Profile and Progress Card */}
        <div className="col-span-1 sm:col-span-2 lg:row-span-2 bg-white-custom rounded-lg border-2 border-dark-gray">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-source-sans text-2xl text-left text-primary font-bold">
                Ikhtisar
              </h1>
            </div>

            {readingHistory[0] && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-4 flex-grow">
                  <div>
                    <p className="text-lg font-medium">
                      {readingHistory[0].murid.nis}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {readingHistory[0].murid.nama}
                    </h1>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-gray-600">
                      {readingHistory[0].murid.alamat}
                    </p>
                  </div>

                  {/* Reading Progress */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Progress Membaca Semester Ini
                    </h3>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-primary">
                            {readingHistory.length}/20 Buku
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-primary">
                            {calculateProgress(readingHistory).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2 mb-4 overflow-hidden rounded bg-gray-100">
                        <div
                          style={{
                            width: `${calculateProgress(readingHistory)}%`,
                          }}
                          className="flex flex-col justify-center rounded bg-primary transition-all duration-300"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Section - Placeholder */}
        <div className="relative order-4 col-span-1 p-6 bg-white border-2 rounded-lg overflow-hidden border-dark-gray lg:row-span-2 lg:order-none sm:col-span-2">
          <h1 className="font-source-sans text-2xl text-center text-primary font-bold">
            Papan Peringkat
          </h1>
          <div className="flex flex-col max-h-96 my-4 gap-2 overflow-y-auto">
            <CardLeaderboardMurid
              name="Muhammad Faruq"
              kelas="7 Al-fatih"
              booksRead={20}
              totalBooksToRead={20}
            />
            <CardLeaderboardMurid
              name="Muhammad Aditya Rinaldi"
              kelas="8 Al-fatih"
              booksRead={16}
              totalBooksToRead={20}
            />
            <CardLeaderboardMurid
              name="Hafidz Alhadid Rahman"
              kelas="9 Al-fatih"
              booksRead={12}
              totalBooksToRead={20}
            />
          </div>
        </div>

        {/* Reading History Table */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-white-custom rounded-lg border-2 border-dark-gray ">
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

            <TableFormBukti data={readingHistory} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormBuktiMurid;
