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

const BASE_TEXT: Record<string, string> = {
  neutral: "text-gray-400",
  water: "text-blue-400",
  earth: "text-yellow-600",
  fire: "text-red-400",
  wind: "text-green-400",
  poison: "text-purple-500",
  holy: "text-yellow-300",
  shadow: "text-gray-800",
  ghost: "text-indigo-300",
  undead: "text-pink-400",
};
export const ElementBadges: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(element).map(([key, value]) => {
        // สีตัวเลขตามค่า %
        let textColor = "text-white";
        if (value > 100) textColor = "text-green-600";
        else if (value < 100) textColor = "text-red-500";

        return (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300"
          >
            {/* Circle Color */}
            <div
              className={`w-3 h-3 rounded-full ${
                BASE_COLORS[key] || "bg-gray-500"
              }`}
            ></div>

            {/* Label + Value */}
            <span className="font-semibold">
              <span className={`${BASE_TEXT[key] || "bg-gray-500"}`}>
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
