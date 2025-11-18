"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import EventModal from "./cenlab-modal";
import MonsterTablePage from "./monster-lab";
import SwitchOnPage from "./switch-on";

interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: string;
  event_binary: string;
}

export default function CentralLabPage() {
  const today = new Date();
  const [DateNow] = useState(today.getDate());
  const [month] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedEventNow, setSelectedEventNow] =
    useState<CalendarEvent | null>(null);

  const [activeTab, setActiveTab] = useState<"daily" | "calendar" | "monster">(
    "daily"
  );

  // Refs สำหรับ scroll
  const dailyRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const monsterRef = useRef<HTMLDivElement>(null);

  const tabs: ("daily" | "calendar" | "monster")[] = [
    "daily",
    "calendar",
    "monster",
  ];

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

  // Helper function สำหรับ code
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

  // Scroll ไป section ตาม tab
  const handleScrollTo = (tab: "daily" | "calendar" | "monster") => {
    setActiveTab(tab);
    const ref =
      tab === "daily"
        ? dailyRef
        : tab === "calendar"
        ? calendarRef
        : monsterRef;
    if (ref.current) {
      const yOffset = -70; // header offset
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Active tab ตาม scroll
  useEffect(() => {
    const { base2, accessCode } = getCodeCenlab(DateNow);

    setTimeout(() => {
      setSelectedEventNow({
        event_date: new Date(year, month, DateNow).toISOString(),
        event_title: `${base2}<div class="text-lg text-gray-700">${accessCode}</div>`,
        event_theme: "bg-pink-500",
        event_binary: base2,
      });
    }, 0);
  }, []);
  useEffect(() => {
    const sections: {
      ref: React.RefObject<HTMLDivElement | null>;
      tab: "daily" | "calendar" | "monster";
    }[] = [
      { ref: dailyRef, tab: "daily" },
      { ref: calendarRef, tab: "calendar" },
      { ref: monsterRef, tab: "monster" },
    ];

    const onScroll = () => {
      const scrollPos = window.scrollY + 80; // header offset
      sections.forEach(({ ref, tab }) => {
        if (ref.current) {
          const top = ref.current.offsetTop;
          const bottom = top + ref.current.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveTab(tab);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="antialiased sans-serif mt-[100px]">
      {/* Top Navigation */}
      <div className="sticky top-[70px] left-0 w-full bg-gray-400 border-b shadow-lg z-50">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleScrollTo(tab)}
              className={`flex flex-col items-center py-2 transition-colors font-bold cursor-pointer ${
                activeTab === tab
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Section */}
      <div ref={dailyRef} className="mb-12 container mx-auto px-4 pt-10">
        <h2 className="text-2xl font-bold mb-2 text-black text-center">
          Daily Code:{selectedEventNow?.event_binary}
        </h2>
        <div className="grid grid-cols-9 grid-rows-3 gap-2 rounded-md overflow-hidden mb-4 mx-auto relative w-[350px] h-[200px] lg:w-[900px] lg:h-[500px] md:w-[750px] md:h-[400px] sm:w-[650px] sm:h-[350px]">
          {/* พื้นหลัง */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage:
                "url('/assets/images/Cenlab/example_switchOn.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* overlay หลอดไฟ */}
          {selectedEventNow && selectedEventNow.event_binary
            ? selectedEventNow.event_binary
                .split("")
                .map((bit, idx) => <SwitchOnPage key={idx} bit={bit} />)
            : null}
        </div>
      </div>

      {/* Calendar Section */}
      <div
        ref={calendarRef}
        className="mb-12 container mx-auto px-4 py-2 md:py-8"
      >
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

          {/* Calendar grid */}
          <div className="overflow-x-auto min-w-[900px]">
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

              <div className="flex flex-wrap border-t border-l shadow-md">
                {blankDays.map((b) => (
                  <div
                    key={`b${b}`}
                    className="text-center border-r border-b px-4 pt-2 w-[14.28%] h-[120px]"
                  ></div>
                ))}

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

                    {getEventsForDate(date).map((event, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedEvent(event)}
                        className={`overflow-hidden mt-1 text-sm p-1 rounded-lg cursor-pointer truncate text-white ${event.event_theme} shadow-xl shadow-gray-500 hover:shadow-2xl active:shadow-sm transition-all duration-200 transform hover:-translate-y-[2px] active:translate-y-[1px]`}
                        dangerouslySetInnerHTML={{ __html: event.event_title }}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monster Section */}
      <div ref={monsterRef} className="mb-12 container mx-auto px-4">
        <MonsterTablePage />
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
