"use client";
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
  console.log(event);
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/90 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full min-h-[600px]">
        <h1 className="font-bold text-3xl text-center text-gray-600 mb-4">
          {new Date(event.event_date).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div
          className="font-semibold mb-2 text-black text-3xl text-center mt-10"
          dangerouslySetInnerHTML={{ __html: event.event_title }}
        ></div>
        <div className="grid grid-cols-9 grid-rows-3 gap-2 w-[900px] h-[500px] rounded-md overflow-hidden mb-4 mx-auto relative">
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
