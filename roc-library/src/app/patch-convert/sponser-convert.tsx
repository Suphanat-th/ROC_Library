"use client"; // 🔹 บังคับให้เป็น Client Component

import React from "react";


export default function SponserConvert() {
  
  return (
    <div className="mx-auto">
<img
        className="w-full"
        src={`/assets/images/PatchTemplate/FooterP2W.png`}
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
