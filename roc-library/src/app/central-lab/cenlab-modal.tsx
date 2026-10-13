"use client";
import { useEffect } from "react";
import SwitchOnPage from "./switch-on";

interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: string;
  event_binary: string;
}

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Central Lab daily code"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral/80"
    >
      <div className="bg-base-100 rounded-lg shadow-lg p-4 sm:p-6 w-full max-h-full overflow-y-auto">
        <h1 className="font-bold text-3xl text-center text-base-content/70 mb-4">
          {new Date(event.event_date).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div
          className="font-semibold mb-2 text-base-content text-3xl text-center mt-10"
          dangerouslySetInnerHTML={{ __html: event.event_title }}
        ></div>
        <div className="grid grid-cols-9 grid-rows-3 gap-2 rounded-md overflow-hidden mb-4 mx-auto relative w-full max-w-4xl aspect-[9/5]">
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
          {event.event_binary.split("").map((bit, idx) => (
            <SwitchOnPage key={idx} bit={bit}></SwitchOnPage>
          ))}
        </div>

        <div className="text-right ">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
