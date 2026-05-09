// components/ElementBadges.tsx
import { ElementMonster } from "@/types/monster";
import React from "react";

interface ElementProps {
  element: ElementMonster;
}

const BASE_COLORS: Record<string, string> = {
  neutral: "bg-gray-400",
  water: "bg-blue-400",
  earth: "bg-yellow-600",
  fire: "bg-red-400",
  wind: "bg-green-400",
  poison: "bg-purple-500",
  holy: "bg-yellow-300",
  shadow: "bg-gray-800",
  ghost: "bg-indigo-300",
  undead: "bg-pink-400",
};

export const ElementBadges: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(element).map(([key, value]) => {
        // สีตัวเลขและ border ตามค่า %
        let textColor = "text-base-content";
        let borderColor = "border-base-300";
        
        if (value > 100) {
          textColor = "text-success font-bold";
          borderColor = "border-success";
        } else if (value < 100) {
          textColor = "text-error font-bold";
          borderColor = "border-error";
        }

        return (
          <div
            key={key}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${borderColor}`}
          >
            {/* Circle Color */}
            <div
              className={`w-3 h-3 rounded-full ${
                BASE_COLORS[key] || "bg-gray-500"
              }`}
            ></div>

            {/* Label + Value */}
            <span className="font-semibold">
              <span className="text-black">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <span className={`ml-1 ${textColor}`}>{value}%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};
