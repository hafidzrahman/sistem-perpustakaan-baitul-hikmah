import React, { useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";

const PeminjamanCalendar = ({ loans }: { loans: any }) => {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth),
  });

  const startingDayOfWeek = getDay(daysInMonth[0]);
  const prevMonthDays =
    startingDayOfWeek > 0
      ? eachDayOfInterval({
          start: add(startOfMonth(firstDayCurrentMonth), {
            days: -startingDayOfWeek,
          }),
          end: add(startOfMonth(firstDayCurrentMonth), { days: -1 }),
        })
      : [];

  const endingDayOfWeek = getDay(daysInMonth[daysInMonth.length - 1]);
  const nextMonthDays =
    endingDayOfWeek < 6
      ? eachDayOfInterval({
          start: add(endOfMonth(firstDayCurrentMonth), { days: 1 }),
          end: add(endOfMonth(firstDayCurrentMonth), {
            days: 6 - endingDayOfWeek,
          }),
        })
      : [];

  let allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  while (allDays.length < 42) {
    const lastDay = allDays[allDays.length - 1];
    allDays.push(add(lastDay, { days: 1 }));
  }

  const previousMonth = () => {
    setCurrentMonth(
      format(add(firstDayCurrentMonth, { months: -1 }), "MMM-yyyy")
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      format(add(firstDayCurrentMonth, { months: 1 }), "MMM-yyyy")
    );
  };

  const selectedDayLoans = loans.filter((loan: any) =>
    isSameDay(parseISO(loan.tanggalPinjam), selectedDay)
  );

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 border-b lg:border-b-0 lg:border-r border-dark-gray pb-6 lg:pb-0 lg:pr-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {format(firstDayCurrentMonth, "MMMM yyyy", { locale: id })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-primary hover:text-white-custom rounded-full transition-colors duration-200"
              >
                ←
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-primary hover:text-white-custom rounded-full transition-colors duration-200"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-text py-2"
              >
                {day}
              </div>
            ))}
            {allDays.map((day, dayIdx) => {
              const hasLoan = loans.some((loan: any) =>
                isSameDay(parseISO(loan.tanggalPinjam), day)
              );

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    relative p-2 w-full h-10 flex items-center justify-center
                    rounded-lg transition-colors duration-200
                    ${
                      !isSameMonth(day, firstDayCurrentMonth)
                        ? "text-gray-text"
                        : ""
                    }
                    ${
                      isEqual(day, selectedDay)
                        ? "bg-primary text-white-custom"
                        : ""
                    }
                    ${
                      isToday(day) && !isEqual(day, selectedDay)
                        ? "text-primary font-bold"
                        : ""
                    }
                    ${
                      !isEqual(day, selectedDay)
                        ? "hover:bg-pastel-green hover:text-primary"
                        : ""
                    }
                  `}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                  {hasLoan && (
                    <span
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 
                      ${
                        isEqual(day, selectedDay)
                          ? "bg-white-custom"
                          : "bg-jewel-red"
                      } 
                      rounded-full`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h3 className="text-lg font-bold text-primary mb-4">
            Peminjaman {format(selectedDay, "dd MMMM yyyy", { locale: id })}
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {selectedDayLoans.length > 0 ? (
              selectedDayLoans.map((loan: any) => (
                <div
                  key={loan.id}
                  className="border-2 border-dark-gray rounded-lg p-4 hover:border-primary transition-colors duration-200"
                >
                  <p className="font-medium text-primary">
                    ID Peminjaman: {loan.id}
                  </p>
                  <p className="text-sm text-gray-text mt-2">
                    Tanggal:{" "}
                    {format(parseISO(loan.tanggalPinjam), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </p>
                  {loan.bukuPinjaman.map((buku: any, index: number) => (
                    <div
                      key={index}
                      className="mt-2 p-2 bg-pastel-green bg-opacity-20 rounded-lg"
                    >
                      <p className="text-sm">ISBN: {buku.bukuISBN}</p>
                      <p className="text-sm text-gray-text">
                        Tenggat:{" "}
                        {format(parseISO(buku.tenggatWaktu), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </p>
                      <p className="text-sm mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            buku.tanggalKembali
                              ? "bg-pastel-green text-jewel-green"
                              : "bg-pastel-red text-jewel-red"
                          }`}
                        >
                          {buku.tanggalKembali ? "Dikembalikan" : "Dipinjam"}
                        </span>
                      </p>
                    </div>
                  ))}
                  {loan.keterangan && (
                    <p className="text-sm text-gray-text mt-2">
                      Keterangan: {loan.keterangan}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-text">
                <p>Tidak ada peminjaman</p>
                <p className="text-sm mt-2">pada tanggal ini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeminjamanCalendar;
