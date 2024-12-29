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

const CalendarPeminjaman = ({ loans }: { loans: any }) => {
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
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-6 lg:gap-4">
        <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-dark-gray pb-2 md:pb-6 lg:pb-4 lg:pr-4">
          <div className="flex items-center justify-between mb-2 md:mb-6 lg:mb-4">
            <h2 className="text-sm md:text-xl lg:text-base font-bold text-primary">
              {format(firstDayCurrentMonth, "MMMM yyyy", { locale: id })}
            </h2>
            <div className="flex gap-1 md:gap-2 lg:gap-1">
              <button
                onClick={previousMonth}
                className="p-0.5 md:p-2 lg:p-1 hover:bg-primary hover:text-white-custom rounded-full transition-colors duration-200 text-xs md:text-base lg:text-sm"
              >
                ←
              </button>
              <button
                onClick={nextMonth}
                className="p-0.5 md:p-2 lg:p-1 hover:bg-primary hover:text-white-custom rounded-full transition-colors duration-200 text-xs md:text-base lg:text-sm"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px md:gap-1 lg:gap-px">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="text-center text-[10px] md:text-sm lg:text-xs font-medium text-gray-text py-0.5 md:py-2 lg:py-1"
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
                    relative p-0.5 md:p-2 lg:p-1 w-full h-6 md:h-10 lg:h-8 flex items-center justify-center
                    rounded-sm md:rounded-lg lg:rounded-md transition-colors duration-200 text-[10px] md:text-base lg:text-xs
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
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 lg:w-0.5 lg:h-0.5
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

        <div className="w-full lg:w-2/5">
          <h3 className="text-xs md:text-lg lg:text-sm font-bold text-primary mb-2 md:mb-4 lg:mb-3">
            Peminjaman {format(selectedDay, "dd MMMM yyyy", { locale: id })}
          </h3>
          <div className="space-y-2 md:space-y-4 lg:space-y-3 max-h-40 md:max-h-64 lg:max-h-56 overflow-y-auto">
            {selectedDayLoans.length > 0 ? (
              selectedDayLoans.map((loan: any) => (
                <div
                  key={loan.id}
                  className="border border-dark-gray rounded-sm md:rounded-lg lg:rounded-md p-2 md:p-4 lg:p-3 hover:border-primary transition-colors duration-200"
                >
                  <p className="font-medium text-primary text-[10px] md:text-base lg:text-xs">
                    ID Peminjaman: {loan.id}
                  </p>
                  <p className="text-[10px] md:text-sm lg:text-xs text-gray-text mt-0.5 md:mt-2 lg:mt-1">
                    Tanggal:{" "}
                    {format(parseISO(loan.tanggalPinjam), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </p>
                  {loan.bukuPinjaman.map((buku: any, index: number) => (
                    <div
                      key={index}
                      className="mt-1 md:mt-2 lg:mt-1.5 p-1 md:p-2 lg:p-1.5 bg-pastel-green bg-opacity-20 rounded-sm md:rounded-lg lg:rounded-md"
                    >
                      <p className="text-[10px] md:text-sm lg:text-xs">
                        ISBN: {buku.bukuISBN}
                      </p>
                      <p className="text-[10px] md:text-sm lg:text-xs text-gray-text">
                        Tenggat:{" "}
                        {format(parseISO(buku.tenggatWaktu), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </p>
                      <p className="text-[10px] md:text-sm lg:text-xs mt-0.5 md:mt-1 lg:mt-0.5">
                        <span
                          className={`px-1 md:px-2 lg:px-1.5 py-0.5 rounded-full text-[8px] md:text-sm lg:text-[10px] ${
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
                    <p className="text-[10px] md:text-sm lg:text-xs text-gray-text mt-1 md:mt-2 lg:mt-1.5">
                      Keterangan: {loan.keterangan}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 md:py-8 lg:py-6 text-gray-text">
                <p className="text-xs md:text-base lg:text-sm">
                  Tidak ada peminjaman
                </p>
                <p className="text-[10px] md:text-sm lg:text-xs mt-0.5 md:mt-2 lg:mt-1">
                  pada tanggal ini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPeminjaman;
