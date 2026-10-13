"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import EventModal from "./cenlab-modal";
import MonsterTablePage from "./monster-lab";
import SwitchOnPage from "./switch-on";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: string;
  event_binary: string;
  event_code: string;
}

type TabType = "daily" | "calendar" | "monster";

// Navbar (4rem) + sticky tab bar + breathing room; mirrored by scroll-mt-28 on sections.
const SECTION_LINE_OFFSET = 112;
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
        event_title: `${spaced}<div class="text-lg text-base-content/80">${accessCode}</div>`,
        event_theme: "bg-accent text-accent-content",
        event_binary: spaced,
        event_code: accessCode,
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
        event_title: `${spaced}<div class="text-lg text-base-content/80">${accessCode}</div>`,
        event_theme: "bg-accent text-accent-content",
        event_binary: spaced,
        event_code: accessCode,
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
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Sections carry scroll-mt-28 so they stop below the navbar and tab bar.
    getRefByTab(tab).current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const tabRefs: { ref: React.RefObject<HTMLDivElement>; tab: TabType }[] = [
      { ref: dailyRef, tab: "daily" },
      { ref: calendarRef, tab: "calendar" },
      { ref: monsterRef, tab: "monster" },
    ];

    const onScroll = () => {
      const line = SECTION_LINE_OFFSET + 1;
      let current: TabType = "daily";
      tabRefs.forEach(({ ref, tab }) => {
        if (ref.current && ref.current.getBoundingClientRect().top <= line) {
          current = tab;
        }
      });
      // The last section can be too short to reach the line; treat the bottom as it.
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        current = "monster";
      }
      setActiveTab(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="antialiased sans-serif">
      {/* Navigation Tabs */}
      <TabNavigation activeTab={activeTab} onTabClick={handleScrollTo} />

      {/* Daily Code Section */}
      <section ref={dailyRef} className="scroll-mt-28 mb-8 sm:mb-12 container mx-auto px-2 sm:px-4 pt-8 sm:pt-10">
        <DailySection selectedEvent={selectedEventNow} />
      </section>

      {/* Calendar Section */}
      <section ref={calendarRef} className="scroll-mt-28 mb-8 sm:mb-12 container mx-auto px-2 sm:px-4 py-2 md:py-8">
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
      <section ref={monsterRef} className="scroll-mt-28 mb-12 container mx-auto px-2 sm:px-4">
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
    <nav
      aria-label="Central Lab sections"
      className="sticky top-16 z-30 border-b border-base-300 bg-base-100 shadow-sm"
    >
      <div className="mx-auto flex max-w-3xl justify-around">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabClick(tab)}
            aria-current={activeTab === tab ? "true" : undefined}
            className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center border-b-2 px-4 py-2 font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-base-content/70 hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
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
          <div className="grid grid-cols-9 grid-rows-3 gap-2 rounded-md overflow-hidden mb-4 mx-auto relative w-full max-w-4xl aspect-[9/5]">
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
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-lg sm:text-2xl text-primary mb-4 justify-center">
            <Timer aria-hidden="true" className="h-6 w-6" /> Stage Timers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {times.map((time) => (
              <div
                key={time.id}
                className="stat bg-base-200 rounded-lg border border-base-300 p-4"
              >
                <div className="stat-title text-center text-base-content font-bold mb-2">
                  {time.label}
                </div>
                <div
                  className={`stat-value mb-4 text-center font-mono text-3xl sm:text-4xl ${
                    time.minutes === 0 && time.seconds === 0
                      ? "text-error"
                      : "text-base-content"
                  }`}
                  role="timer"
                  aria-label={time.label}
                >
                  {String(time.minutes).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
                </div>
                <div className="stat-desc text-center text-xs mb-4">
                  {runningTimers[time.id - 1] ? "Running" : "Paused"}
                </div>
                {/* Control Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => toggleTimer(time.id)}
                    className={`btn btn-sm gap-1 ${
                      runningTimers[time.id - 1]
                        ? "btn-warning"
                        : "btn-primary"
                    }`}
                  >
                    {runningTimers[time.id - 1] ? (
                      <><Pause aria-hidden="true" className="h-4 w-4" /> Pause</>
                    ) : (
                      <><Play aria-hidden="true" className="h-4 w-4" /> Start</>
                    )}
                  </button>
                  <button
                    onClick={() => resetTimer(time.id)}
                    className="btn btn-sm btn-outline gap-1"
                  >
                    <RotateCcw aria-hidden="true" className="h-4 w-4" /> Reset
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
    <div className="rounded-xl overflow-hidden bg-base-100 shadow-xl border border-base-300">
      {/* Header */}
      <div className="bg-primary text-primary-content py-3 sm:py-6 px-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-4xl font-bold">
              {monthNames[month]}
            </span>
            <span className="ml-2 sm:ml-3 text-sm sm:text-lg opacity-80 font-normal">{year}</span>
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
        <div key={day} className="px-1 sm:px-2 py-2 sm:py-3 text-[10px] sm:text-sm font-bold text-center bg-neutral text-neutral-content uppercase tracking-widest rounded-t-md">
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
          className="bg-base-200"
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
        isTodayFlag ? "bg-primary/10 border-primary/40" : "bg-base-100 border-base-300"
      }`}
    >
      {/* Date Number */}
      <div
        className={`inline-flex w-6 h-6 sm:w-8 sm:h-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold mb-1 sm:mb-2 ${
          isTodayFlag ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"
        }`}
      >
        {date}
      </div>

      {/* Events */}
      <div className="space-y-0.5 sm:space-y-1">
        {events.map((event, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectEvent(event)}
            aria-label={`รหัส ${event.event_binary} วันที่ ${date}`}
            className={`block w-full cursor-pointer overflow-hidden rounded p-0.5 text-left text-[10px] sm:p-1.5 sm:text-xs ${event.event_theme} transition-transform hover:scale-[1.03] active:scale-95`}
          >
            <span className="block truncate">{event.event_binary}</span>
            <span className="block truncate text-sm font-semibold sm:text-base">
              {event.event_code}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
