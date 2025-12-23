"use client"; // 🔹 บังคับให้เป็น Client Component

import React, { useEffect, useState } from "react";

function parseOption(text: string[]): string {
  if (!text) return "";
  const textDesc: string[] = [];
  let isOption = false;

  for (const f of text) {
    if (f.includes("ประเภท :")) {
      isOption = true;
    }
    if (!isOption) continue;

    let typeEquiment = "พลังป้องกัน";
    if (f.includes("ประเภท :")) {
      let splitType: string[] = [];
      if (f.includes("พลังป้องกัน :")) {
        splitType = f.split("พลังป้องกัน");
      } else {
        typeEquiment = "พลังโจมตี";
        splitType = f.split("พลังโจมตี");
      }
      const equimentType = splitType[0].split(":");
      textDesc.push(
        `<span>${equimentType[0]}</span>:<span class='text-orange-600 font-extrabold'>${equimentType[1]}</span><br>`
      );
      if (splitType[1]) {
        const equimentProtect = splitType[1].split(":");
        textDesc.push(
          `<span>${typeEquiment}</span> : <span class='text-orange-600 font-extrabold'>${equimentProtect[1]}</span><br>`
        );
      }
    } else if (f.includes("ธาตุ :")) {
      const splitType = f.split("ธาตุ");
      const equimentPosition = splitType[0].split(":");
      const equimentType = splitType[1].split(":");
      textDesc.push(
        `<span>${equimentPosition[0]}</span>:<span class='text-orange-600 font-extrabold'>${equimentPosition[1]}</span><br>`
      );
      textDesc.push(
        `<span>ธาตุ</span> : <span class='text-orange-600 font-extrabold'> ${equimentType[1]}</span><br>`
      );
    } else if (f.includes("ตำแหน่ง :")) {
      const splitType = f.split("น้ำหนัก");
      const equimentPosition = splitType[0].split(":");
      const equimentWeight = splitType[1].split(":");
      textDesc.push(
        `<span>${equimentPosition[0]}</span>:<span class='text-orange-600 font-extrabold'>${equimentPosition[1]}</span><br>`
      );
      textDesc.push(
        `<span>น้ำหนัก</span> : <span class='text-orange-600 font-extrabold'>${equimentWeight[1]}</span><br>`
      );
    } else {
      const equimentOther = f.split(":");
      textDesc.push(
        `<span>${equimentOther[0]}</span> : <span class='text-orange-600 font-extrabold'>${equimentOther[1]}</span><br>`
      );
    }
  }

  return textDesc.join("");
}

export default function OptionConvertPage({
  identifiedDescriptionName,
}: {
  identifiedDescriptionName: string[];
}) {
  const [identifiedDescription, setIdentifiedDescription] = useState("");
  useEffect(() => {
    setIdentifiedDescription(parseOption(identifiedDescriptionName));
  }, [identifiedDescriptionName]);

  if (!identifiedDescription?.trim()) return null;

  return (
    <div className="bg-linear-to-br from-white to-gray-50 p-5 rounded-2xl shadow-md border border-gray-100 row-span-1 col-span-2 w-full">
      <div
        className="text-sm text-gray-800 leading-relaxed text-left"
        dangerouslySetInnerHTML={{ __html: identifiedDescription }}
      />
    </div>
  );
}
