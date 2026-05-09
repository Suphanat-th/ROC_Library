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

type TabType = "daily" | "calendar" | "monster";

const HEADER_OFFSET = 70;
const SCROLL_OFFSET = 80;
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TABS: TabType[] = ["daily", "calendar", "monster"];

export default function CentralLabPage() {
  const today = new Date();
  const [DateNow] = useState(today.getDate());
  const [month] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedEventNow] = useState<CalendarEvent | null>(
    (() => {
      const code = (DateNow + (month + 1)) * 5;
      const base2 = code.toString(2).padStart(8, "0");
      const spaced = base2.slice(0, 4) + " " + base2.slice(4);
      const accessCode = code.toString();
      return {
        event_date: new Date(year, month, DateNow).toISOString(),
        event_title: `${spaced}<div class="text-lg text-gray-700">${accessCode}</div>`,
        event_theme: "bg-pink-500",
        event_binary: spaced,
      };
    })()
  );
  const [activeTab, setActiveTab] = useState<TabType>("daily");

  const dailyRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const monsterRef = useRef<HTMLDivElement>(null);

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  );
  
  const firstDayOfMonth = useMemo(
    () => new Date(year, month).getDay(),
    [year, month],
  );
  
  const blankDays = useMemo(
    () => Array.from({ length: firstDayOfMonth }, (_, i) => i + 1),
    [firstDayOfMonth],
  );
  
  const noOfDays = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  const events: CalendarEvent[] = useMemo(() => {
    return noOfDays.map((day) => {
      const code = (day + (month + 1)) * 5;
      const base2 = code.toString(2).padStart(8, "0");
      const spaced = base2.slice(0, 4) + " " + base2.slice(4);
      const accessCode = code.toString();
      return {
        event_date: new Date(year, month, day).toISOString(),
        event_title: `${spaced}<div class="text-lg text-gray-700">${accessCode}</div>`,
        event_theme: "bg-pink-500",
        event_binary: spaced,
      };
    });
  }, [noOfDays, year, month]);

  const isToday = (date: number) => {
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString();
  };

  const getEventsForDate = (date: number) => {
    const d = new Date(year, month, date).toDateString();
    return events.filter((ev) => new Date(ev.event_date).toDateString() === d);
  };

  const getRefByTab = (tab: TabType) => {
    const refMap: Record<TabType, React.RefObject<HTMLDivElement>> = {
      daily: dailyRef,
      calendar: calendarRef,
      monster: monsterRef,
    };
    return refMap[tab];
  };

  const handleScrollTo = (tab: TabType) => {
    setActiveTab(tab);
    const ref = getRefByTab(tab);
    if (ref.current) {
      const yOffset = -HEADER_OFFSET;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const tabRefs: { ref: React.RefObject<HTMLDivElement>; tab: TabType }[] = [
      { ref: dailyRef, tab: "daily" },
      { ref: calendarRef, tab: "calendar" },
      { ref: monsterRef, tab: "monster" },
    ];

    const onScroll = () => {
      const scrollPos = window.scrollY + SCROLL_OFFSET;
      tabRefs.forEach(({ ref, tab }) => {
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
    <div className="antialiased sans-serif pt-16">
      {/* Navigation Tabs */}
      <TabNavigation activeTab={activeTab} onTabClick={handleScrollTo} />

      {/* Daily Code Section */}
      <section ref={dailyRef} className="mb-8 sm:mb-12 container mx-auto px-2 sm:px-4 pt-8 sm:pt-10">
        <DailySection selectedEvent={selectedEventNow} />
      </section>

      {/* Calendar Section */}
      <section ref={calendarRef} className="mb-8 sm:mb-12 container mx-auto px-2 sm:px-4 py-2 md:py-8">
        <CalendarSection
          month={month}
          year={year}
          days={DAYS_OF_WEEK}
          monthNames={MONTH_NAMES}
          blankDays={blankDays}
          noOfDays={noOfDays}
          isToday={isToday}
          getEventsForDate={getEventsForDate}
          onSelectEvent={setSelectedEvent}
        />
      </section>

      {/* Monster Section */}
      <section ref={monsterRef} className="mb-12 container mx-auto px-2 sm:px-4">
        <MonsterTablePage />
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

/* ============ Sub Components ============ */

interface TabNavigationProps {
  activeTab: TabType;
  onTabClick: (tab: TabType) => void;
}

function TabNavigation({ activeTab, onTabClick }: TabNavigationProps) {
  return (
    <div className="fixed top-17.5 left-0 w-full bg-gray-400 border-b shadow-lg z-50">
      <div className="flex justify-around">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`flex flex-col items-center py-2 px-4 transition-colors font-bold cursor-pointer capitalize ${
              activeTab === tab ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

interface DailySectionProps {
  selectedEvent: CalendarEvent | null;
}

function DailySection({ selectedEvent }: DailySectionProps) {
  const initialTimes = [
    { id: 1, minutes: 2, seconds: 30, label: "Stage 1", initialMinutes: 2, initialSeconds: 30 },
    { id: 2, minutes: 1, seconds: 20, label: "Stage 2", initialMinutes: 1, initialSeconds: 20 },
    { id: 3, minutes: 2, seconds: 40, label: "Stage 3", initialMinutes: 2, initialSeconds: 40 },
  ];

  const [times, setTimes] = useState(initialTimes);
  const [runningTimers, setRunningTimers] = useState<boolean[]>([false, false, false]);
  const [alarmPlayed, setAlarmPlayed] = useState<boolean[]>([false, false, false]);

  const playAlarmSound = async () => {
    for (let i = 0; i < 3; i++) {
      const audio = new Audio("/assets/sound/beep.mp3");
      audio.volume = 0.8;
      await new Promise((resolve) => {
        audio.play();
        audio.onended = () => resolve(null);
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const toggleTimer = (id: number) => {
    const index = id - 1;
    setRunningTimers((prev) => {
      const newRunning = [...prev];
      newRunning[index] = !newRunning[index];
      return newRunning;
    });
  };

  const resetTimer = (id: number) => {
    const index = id - 1;
    setTimes((prev) =>
      prev.map((time, idx) =>
        idx === index
          ? { ...time, minutes: time.initialMinutes, seconds: time.initialSeconds }
          : time
      )
    );
    setRunningTimers((prev) => {
      const newRunning = [...prev];
      newRunning[index] = false;
      return newRunning;
    });
    setAlarmPlayed((prev) => {
      const newAlarmPlayed = [...prev];
      newAlarmPlayed[index] = false;
      return newAlarmPlayed;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimes((prevTimes) =>
        prevTimes.map((time, idx) => {
          if (!runningTimers[idx]) return time;

          let { minutes, seconds } = time;
          if (seconds > 0) {
            seconds--;
          } else if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            // Timer จบแล้ว ให้หยุดนับต่อ
            setRunningTimers((prev) => {
              const newRunning = [...prev];
              newRunning[idx] = false;
              return newRunning;
            });
            return time;
          }
          return { ...time, minutes, seconds };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTimers]);

  // Check for timer completion and play alarm
  useEffect(() => {
    times.forEach((time, idx) => {
      if (
        time.minutes === 0 &&
        time.seconds === 0 &&
        !alarmPlayed[idx]
      ) {
        playAlarmSound();
        setAlarmPlayed((prev) => {
          const newAlarmPlayed = [...prev];
          newAlarmPlayed[idx] = true;
          return newAlarmPlayed;
        });
      }
    });
  }, [times, alarmPlayed]);

  return (
    <div className="space-y-6">
      {/* Daily Code Header Section */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-primary text-center">
            Daily Code: {selectedEvent?.event_binary || "---"}
          </h2>
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-base-content text-center">
            รหัสเข้า Central Laboratory ตามไฟที่เปิดในภาพได้เลยครับ
          </h3>
          
          {/* Switch Image */}
          <div className="grid grid-cols-9 grid-rows-3 gap-2 rounded-md overflow-hidden mb-4 mx-auto relative w-[350px] h-[200px] lg:w-[900px] lg:h-[500px] md:w-[750px] md:h-[400px] sm:w-[650px] sm:h-[350px]">
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: "url('/assets/images/Cenlab/example_switchOn.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            {selectedEvent?.event_binary
              ? selectedEvent.event_binary.split("").map((bit, idx) => (
                  <SwitchOnPage key={idx} bit={bit} />
                ))
              : null}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider my-4"></div>

      {/* Timer Section */}
      <div className="card bg-linear-to-br from-blue-50 to-indigo-50 shadow-lg border border-indigo-300">
        <div className="card-body">
          <h2 className="card-title text-lg sm:text-2xl text-indigo-600 mb-4 justify-center">
            ⏱️ Stage Timers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {times.map((time) => (
              <div
                key={time.id}
                className="stat bg-white rounded-lg shadow-md border border-indigo-200 hover:shadow-lg transition-shadow p-4"
              >
                <div className="stat-title text-center text-indigo-600 font-bold mb-2">
                  {time.label}
                </div>
                <div className="stat-value text-center text-3xl sm:text-4xl text-error font-mono mb-4">
                  {String(time.minutes).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
                </div>
                <div className="stat-desc text-center text-xs mb-4">
                  {runningTimers[time.id - 1] ? "⏱️ Running" : "⏸️ Paused"}
                </div>
                {/* Control Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => toggleTimer(time.id)}
                    className={`btn btn-sm ${
                      runningTimers[time.id - 1]
                        ? "btn-warning"
                        : "btn-success"
                    }`}
                  >
                    {runningTimers[time.id - 1] ? "⏸ Pause" : "▶ Start"}
                  </button>
                  <button
                    onClick={() => resetTimer(time.id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CalendarSectionProps {
  month: number;
  year: number;
  days: string[];
  monthNames: string[];
  blankDays: number[];
  noOfDays: number[];
  isToday: (date: number) => boolean;
  getEventsForDate: (date: number) => CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

function CalendarSection({
  month,
  year,
  days,
  monthNames,
  blankDays,
  noOfDays,
  isToday,
  getEventsForDate,
  onSelectEvent,
}: CalendarSectionProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-linear-to-r from-rose-500 to-rose-600 py-3 sm:py-6 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white text-2xl sm:text-4xl font-bold">
              {monthNames[month]}
            </span>
            <span className="ml-2 sm:ml-3 text-sm sm:text-lg text-rose-100 font-normal">{year}</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          <CalendarHeader days={days} />
          <CalendarGrid
            blankDays={blankDays}
            noOfDays={noOfDays}
            isToday={isToday}
            getEventsForDate={getEventsForDate}
            onSelectEvent={onSelectEvent}
          />
        </div>
      </div>
    </div>
  );
}

function CalendarHeader({ days }: { days: string[] }) {
  return (
    <>
      {days.map((day) => (
        <div key={day} className="px-1 sm:px-2 py-2 sm:py-3 text-[10px] sm:text-sm font-bold text-center text-white bg-linear-to-b from-gray-700 to-gray-600 uppercase tracking-widest rounded-t-md">
          {day}
        </div>
      ))}
    </>
  );
}

interface CalendarGridProps {
  blankDays: number[];
  noOfDays: number[];
  isToday: (date: number) => boolean;
  getEventsForDate: (date: number) => CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

function CalendarGrid({
  blankDays,
  noOfDays,
  isToday,
  getEventsForDate,
  onSelectEvent,
}: CalendarGridProps) {
  return (
    <>
      {blankDays.map((b) => (
        <div
          key={`b${b}`}
          className="bg-gray-50"
        />
      ))}

      {noOfDays.map((date) => (
        <CalendarDay
          key={date}
          date={date}
          isToday={isToday(date)}
          events={getEventsForDate(date)}
          onSelectEvent={onSelectEvent}
        />
      ))}
    </>
  );
}

interface CalendarDayProps {
  date: number;
  isToday: boolean;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

function CalendarDay({
  date,
  isToday: isTodayFlag,
  events,
  onSelectEvent,
}: CalendarDayProps) {
  return (
    <div
      className={`min-h-20 sm:min-h-24 md:min-h-32 p-1 sm:p-2 md:p-3 rounded-lg border transition-all ${
        isTodayFlag ? "bg-blue-50 border-blue-300 shadow-md" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Date Number */}
      <div
        className={`inline-flex w-6 h-6 sm:w-8 sm:h-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold mb-1 sm:mb-2 ${
          isTodayFlag ? "bg-blue-500 text-white shadow-lg" : "bg-linear-to-br from-purple-600 to-purple-700 text-white"
        }`}
      >
        {date}
      </div>

      {/* Events */}
      <div className="space-y-0.5 sm:space-y-1">
        {events.map((event, idx) => (
          <div
            key={idx}
            onClick={() => onSelectEvent(event)}
            className={`overflow-hidden text-[10px] sm:text-xs p-0.5 sm:p-1.5 rounded cursor-pointer truncate text-white ${event.event_theme} shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 line-clamp-1 sm:line-clamp-2`}
            dangerouslySetInnerHTML={{ __html: event.event_title }}
          />
        ))}
      </div>
    </div>
  );
}
