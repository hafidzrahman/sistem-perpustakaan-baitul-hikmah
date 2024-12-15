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
  startOfToday,
} from "date-fns";
import { id } from "date-fns/locale";

const peminjaman = [
  {
    id: 1,
    nama: "Muhammad Faruq",
    judul: "Funicula Funiculi",
    startDatetime: "2024-12-15",
    endDatetime: "2024-12-19",
  },
  {
    id: 2,
    nama: "Muhammad Faruq",
    judul: "Killing Commandantore 2",
    startDatetime: "2024-12-21",
    endDatetime: "2024-12-29",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function PeminjamanCalendar() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  // Mendapatkan hari-hari untuk ditampilkan, termasuk hari dari bulan sebelumnya dan sesudahnya
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth),
  });

  // Tambahkan hari dari bulan sebelumnya
  const startingDayOfWeek = getDay(daysInMonth[0]);
  const prevMonthDays =
    startingDayOfWeek > 0
      ? eachDayOfInterval({
          start: add(startOfMonth(firstDayCurrentMonth), {
            days: -startingDayOfWeek,
          }),
          end: add(startOfMonth(firstDayCurrentMonth), { days: -1 }), // Hingga hari sebelum tanggal 1
        })
      : [];

  // Tambahkan hari dari bulan sesudahnya
  const endingDayOfWeek = getDay(daysInMonth[daysInMonth.length - 1]);
  const nextMonthDays =
    endingDayOfWeek < 6
      ? eachDayOfInterval({
          start: add(endOfMonth(firstDayCurrentMonth), { days: 1 }), // Mulai dari hari setelah akhir bulan
          end: add(endOfMonth(firstDayCurrentMonth), {
            days: 6 - endingDayOfWeek,
          }),
        })
      : [];

  // Gabungkan semua hari
  // Gabungkan semua hari
  let allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  // Pastikan total hari menjadi 42
  if (allDays.length < 42) {
    const additionalDaysNeeded = 42 - allDays.length;
    allDays = [
      ...allDays,
      ...eachDayOfInterval({
        start: add(endOfMonth(firstDayCurrentMonth), {
          days: nextMonthDays.length + 1,
        }),
        end: add(endOfMonth(firstDayCurrentMonth), {
          days: nextMonthDays.length + additionalDaysNeeded,
        }),
      }),
    ];
  }

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const selectedDayPeminjaman = peminjaman.filter((peminjaman) =>
    isSameDay(parseISO(peminjaman.startDatetime), selectedDay)
  );

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="w-[60%] border-r-2 pr-2 border-primary">
          <div className="flex flex-col items-start justify-end">
            <h2 className="flex-auto font-semibold text-black-custom">
              {format(firstDayCurrentMonth, "MMMM yyyy", { locale: id })}
            </h2>
            <div className="flex gap-4 -mt-1">
              <button
                type="button"
                onClick={previousMonth}
                className="text-primary hover:text-jewel-green font-black"
              >
                ←
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="text-primary hover:text-jewel-green font-black"
              >
                →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 mt-3.5 text-xs text-center text-primary font-bold">
            {["Ahad", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 mt-2 text-sm">
            {allDays.map((day, dayIdx) => (
              <div
                key={`${format(day, "yyyy-MM-dd")}-${dayIdx}`} // Unique key
                className={`${
                  dayIdx === 0 && getDay(day) > 0
                    ? `col-start-${getDay(day) + 1}`
                    : ""
                }`}
              >
                <button
                  onClick={() => setSelectedDay(day)}
                  className={classNames(
                    isEqual(day, selectedDay) && "text-white-custom",
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "text-light-primary",
                    isSameMonth(day, firstDayCurrentMonth)
                      ? "text-black-custom"
                      : "text-gray-400", // Warna abu-abu untuk bulan lain
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "border-pastel-green border-2 bg-jewel-green",
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "border-pastel-blue border-2 bg-jewel-blue",
                    !isEqual(day, selectedDay) && "hover:bg-gray-200",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                    "mx-auto relative flex h-8 w-8 items-center justify-center rounded-full"
                  )}
                >
                  {format(day, "d")}
                  {peminjaman.some((peminjaman) =>
                    isSameDay(parseISO(peminjaman.startDatetime), day)
                  ) && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-jewel-red border-pastel-red border-2 rounded-full" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
        <section className="w-[40%] pr-2">
          <h2 className="font-semibold text-black-custom text-base">
            Peminjaman pada
          </h2>
          <h3 className="text-xs font-bold text-primary">
            {format(selectedDay, "dd MMMM yyyy", { locale: id })}
          </h3>
          <div className="mt-4 space-y-1 text-sm text-gray-500">
            {selectedDayPeminjaman.length > 0 ? (
              selectedDayPeminjaman.map((peminjaman) => (
                <div key={peminjaman.id} className="flex">
                  <div>
                    <p className="text-black-custom font-source-serif font-bold">
                      {peminjaman.judul}
                    </p>
                    <p className="text-black-custom font-medium">
                      Dipinjam oleh: {peminjaman.nama}
                    </p>
                    <p className="text-gray-text text-xs">
                      {format(
                        parseISO(peminjaman.startDatetime),
                        "dd MMMM yyyy",
                        { locale: id }
                      )}{" "}
                      -{" "}
                      {format(
                        parseISO(peminjaman.endDatetime),
                        "dd MMMM yyyy",
                        { locale: id }
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="to-gray-text">
                Tidak ada peminjaman pada tanggal ini
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PeminjamanCalendar;
