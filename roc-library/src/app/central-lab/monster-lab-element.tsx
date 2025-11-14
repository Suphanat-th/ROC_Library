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
        // กำหนดสีตัวเลขตามค่า %
        let textColor = "text-white"; // ค่า 100 สีขาว
        if (value > 100) textColor = "text-green-700";
        else if (value < 100) textColor = "text-black";

        return (
          <div
            key={key}
            className={`px-3 py-1 rounded-full font-semibold ${BASE_COLORS[key] || "bg-gray-500"}`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
            <span className={textColor}>{value}%</span>
          </div>
        );
      })}
    </div>
  );
};
