"use client"; // 🔹 บังคับให้เป็น Client Component

import React from "react";

export default function SponserConvert() {
  return (
    <div className="w-full">
      <img
        className="w-full"
        src={`/assets/images/PatchTemplate/wantad.png`}
        alt="item image"
        width={150}
        height={300}
        onError={(e) => {
          e.currentTarget.src = "/assets/images/GuildImage/dog.jpg";
        }}
      />
    </div>
  );
}
