import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Calendar01Icon,
} from "hugeicons-react";

// Definisi tipe data untuk aktivitas peminjaman
interface LoanActivity {
  date: Date;
  books: {
    title: string;
    borrowedBy: string;
  }[];
}

// Data dummy aktivitas peminjaman
const mockLoanActivities: LoanActivity[] = [
  {
    date: new Date(2024, 2, 15),
    books: [
      { title: "Laskar Pelangi", borrowedBy: "Ahmad" },
      { title: "Negeri 5 Menara", borrowedBy: "Siti" },
    ],
  },
  {
    date: new Date(2024, 2, 20),
    books: [{ title: "Ayat-Ayat Cinta", borrowedBy: "Budi" }],
  },
];

const PeminjamanCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mendapatkan hari-hari dalam bulan
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Cek apakah tanggal memiliki aktivitas
  const hasActivity = (date: Date) => {
    return mockLoanActivities.some(
      (activity) => activity.date.toDateString() === date.toDateString()
    );
  };

  // Dapatkan aktivitas untuk tanggal tertentu
  const getActivityForDate = (date: Date) => {
    return mockLoanActivities.find(
      (activity) => activity.date.toDateString() === date.toDateString()
    );
  };

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-white border-2 border-primary rounded-lg overflow-hidden max-w-xl mx-auto">
      {/* Header Kalender */}
      <div className="bg-light-primary text-white py-1 px-4 flex justify-between items-center">
        <button
          onClick={() => changeMonth("prev")}
          className="hover:bg-primary p-1 rounded-full"
        >
          <ArrowLeft01Icon />
        </button>
        <h2 className="text-md font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: id })}
        </h2>
        <button
          onClick={() => changeMonth("next")}
          className="hover:bg-primary p-1 rounded-full"
        >
          <ArrowRight01Icon />
        </button>
      </div>

      {/* Grid Kalender */}
      <div className="grid grid-cols-7 gap-1 p-2 text-center">
        {["Ahad", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day} className="text-xs font-normal text-primary">
            {day}
          </div>
        ))}

        {calendarDays.map((date) => {
          const activity = getActivityForDate(date);
          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`
                p-2 rounded-lg transition-all 
                ${!isSameMonth(date, currentDate) ? "text-gray-300" : ""} 
                ${isToday(date) ? "bg-green-100 font-bold" : ""}
                ${hasActivity(date) ? "bg-blue-100 font-semibold" : ""}
                ${
                  selectedDate?.toDateString() === date.toDateString()
                    ? "ring-2 ring-indigo-500"
                    : ""
                }
                hover:bg-indigo-50
              `}
            >
              {date.getDate()}
              {hasActivity(date) && (
                <div className="absolute top-0 right-0 m-1">
                  <BookOpen01Icon />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Aktivitas */}
      {selectedDate && (
        <div className="p-4 border-t">
          <h3 className="font-bold text-lg mb-2">
            Aktivitas pada{" "}
            {format(selectedDate, "dd MMMM yyyy", { locale: id })}
          </h3>

          {getActivityForDate(selectedDate)?.books.length ? (
            <div className="space-y-2">
              {getActivityForDate(selectedDate)?.books.map((book, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 p-2 rounded-lg"
                >
                  <Calendar01Icon />
                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-gray-600">
                      Dipinjam oleh {book.borrowedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Tidak ada aktivitas pada tanggal ini
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PeminjamanCalendar;
