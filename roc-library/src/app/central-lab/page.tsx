"use client"; // 🔹 ต้องอยู่บนสุด
import { useMemo, useState } from "react";
import EventModal from "./cenlab-modal";

interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: string;
  event_binary: string;
}
export default function CentralLabPage() {
  // ---------------------------
  // Initial month/year
  // ---------------------------
  const today = new Date();
  const [month] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  // ---------------------------
  // Days / Month names
  // ---------------------------
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ---------------------------
  // Helper function
  // ---------------------------
  function getCodeCenlab(day: number): { base2: string; accessCode: string } {
    const code = (day + (month + 1)) * 5;
    const base2 = code.toString(2).padStart(8, "0");
    const spaced = base2.slice(0, 4) + " " + base2.slice(4);
    return { base2: spaced, accessCode: code.toString() };
  }

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );
  const firstDayOfMonth = useMemo(
    () => new Date(year, month).getDay(),
    [year, month]
  );

  const blankDays = useMemo(
    () => Array.from({ length: firstDayOfMonth }, (_, i) => i + 1),
    [firstDayOfMonth]
  );

  const noOfDays = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const events: CalendarEvent[] = useMemo(
    () =>
      noOfDays.map((day) => {
        const { base2, accessCode } = getCodeCenlab(day);
        return {
          event_date: new Date(year, month, day).toISOString(),
          event_title: `${base2}<div class="text-lg text-gray-700">${accessCode}</div>`,
          event_theme: "bg-pink-500",
          event_binary: base2,
        };
      }),
    [noOfDays, year, month]
  );

  const isToday = (date: number) => {
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString();
  };

  const getEventsForDate = (date: number) => {
    const d = new Date(year, month, date).toDateString();
    return events.filter((ev) => new Date(ev.event_date).toDateString() === d);
  };

  return (
    <div className="antialiased sans-serif mt-[150px]">
      <div className="container mx-auto px-4 py-2 md:py-8">
        <div className="rounded-lg overflow-hidden bg-gray-50 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between py-2 px-6">
            <div>
              <span className="text-rose-500 text-3xl font-bold">
                {monthNames[month]}
              </span>
              <span className="ml-1 text-lg text-gray-600 font-normal">
                {year}
              </span>
            </div>
          </div>

          {/* ✅ Scroll container */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Day names */}
              <div className="-mx-1 -mb-1">
                <div className="flex flex-wrap">
                  {days.map((day) => (
                    <div
                      key={day}
                      className="px-2 py-2 w-[14.28%] text-sm font-bold text-center text-gray-600 uppercase tracking-wide"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="flex flex-wrap border-t border-l shadow-md">
                  {/* Blank Days */}
                  {blankDays.map((b) => (
                    <div
                      key={`b${b}`}
                      className="text-center border-r border-b px-4 pt-2 w-[14.28%] h-[120px]"
                    ></div>
                  ))}

                  {/* Actual Days */}
                  {noOfDays.map((date) => (
                    <div
                      key={date}
                      className={`text-center border-r border-b px-4 pt-2 w-[14.28%] h-[120px] relative ${
                        isToday(date) ? "bg-blue-100" : ""
                      }`}
                    >
                      <div
                        className={`inline-flex w-6 h-6 items-center justify-center rounded-full ${
                          isToday(date)
                            ? "bg-blue-500 text-white"
                            : "text-white bg-purple-700"
                        } text-base`}
                      >
                        {date}
                      </div>

                      {/* Events */}
                      {getEventsForDate(date).map((event, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedEvent(event)}
                          className={`
      overflow-hidden mt-1 text-sm p-1 rounded-lg cursor-pointer truncate text-white 
      ${event.event_theme}
      shadow-xl shadow-gray-500 hover:shadow-2xl active:shadow-sm 
      transition-all duration-200 transform hover:-translate-y-[2px] active:translate-y-[1px]
    `}
                          dangerouslySetInnerHTML={{
                            __html: event.event_title,
                          }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ✅ End scroll container */}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
