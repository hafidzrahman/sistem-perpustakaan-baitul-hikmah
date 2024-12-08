"use client";

import React, { useState } from "react";
import { format, isWithinInterval, isSameDay, addDays } from "date-fns";

// Simplified lending record interface for single student
interface LendingRecord {
  id: number;
  startDate: string;
  endDate: string;
  bookTitle: string;
}

const PeminjamanCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Single weekly lending record
  const [lendingRecord, setLendingRecord] = useState<LendingRecord | null>({
    id: 1,
    startDate: "2024-02-19", // Misalnya mulai dari Senin
    endDate: "2024-02-25", // Sampai Minggu
    bookTitle: "Laskar Pelangi",
  });

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    // Add previous month's days
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push(null);
    }

    // Add current month's days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Check if a date is within current lending period
  const isDateInLendingPeriod = (date: Date) => {
    if (!lendingRecord) return false;
    return isWithinInterval(date, {
      start: new Date(lendingRecord.startDate),
      end: new Date(lendingRecord.endDate),
    });
  };

  // Month navigation
  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white border-primary border-2 rounded-lg p-6 max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth("prev")}
          className="hover:bg-gray-100 rounded-full p-2"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {currentDate.toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() => changeMonth("next")}
          className="hover:bg-gray-100 rounded-full p-2"
        >
          →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-gray-500 font-semibold mb-4">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {generateCalendarDays().map((date, index) => {
          const isLendingPeriod = date ? isDateInLendingPeriod(date) : false;

          return (
            <div
              key={index}
              className={`
                relative aspect-square flex items-center justify-center 
                ${date ? "cursor-pointer" : "text-gray-300"}
                ${isLendingPeriod ? "bg-blue-100" : "hover:bg-gray-100"}
              `}
              onClick={() => date && setSelectedDate(date)}
            >
              {date && (
                <>
                  <div className="text-center">{date.getDate()}</div>
                  {isLendingPeriod && (
                    <div
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2 
                      w-2 h-2 rounded-full bg-blue-500"
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && lendingRecord && isDateInLendingPeriod(selectedDate) && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">
            Detail Peminjaman {selectedDate.toLocaleDateString("id-ID")}
          </h3>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium">{lendingRecord.bookTitle}</p>
            <p className="text-sm text-gray-600">Periode Peminjaman:</p>
            <p className="text-xs text-gray-500">
              {format(new Date(lendingRecord.startDate), "dd MMM yyyy")} -
              {format(new Date(lendingRecord.endDate), "dd MMM yyyy")}
            </p>
            <div className="mt-2 p-2 bg-blue-100 rounded text-blue-800 text-xs">
              Sedang Dipinjam
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeminjamanCalendar;
