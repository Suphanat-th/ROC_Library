const VALUE = "font-extrabold text-orange-700";

function parseOption(text: string[]): string {
  if (!text) return "";
  const textDesc: string[] = [];
  let isOption = false;

  for (const f of text) {
    if (f.includes("ประเภท :") || f.includes("ประเภท:")) {
      isOption = true;
    }
    if (!isOption) continue;

    let typeEquiment = "พลังป้องกัน";
    if (f.includes("ประเภท :") || f.includes("ประเภท:")) {
      let splitType: string[] = [];
      if (f.includes("พลังป้องกัน :")) {
        splitType = f.split("พลังป้องกัน");
      } else {
        typeEquiment = "พลังโจมตี";
        splitType = f.split("พลังโจมตี");
      }
      const equimentType = splitType[0].split(":");
      textDesc.push(
        `<span>${equimentType[0]}</span>:<span class='${VALUE}'>${equimentType[1]}</span><br>`,
      );
      if (splitType[1]) {
        const equimentProtect = splitType[1].split(":");
        textDesc.push(
          `<span>${typeEquiment}</span> : <span class='${VALUE}'>${equimentProtect[1]}</span><br>`,
        );
      }
    } else if (f.includes("ธาตุ :")) {
      const splitType = f.split("ธาตุ");
      const equimentPosition = splitType[0].split(":");
      const equimentType = (splitType[1] ?? "").split(":");
      textDesc.push(
        `<span>${equimentPosition[0]}</span>:<span class='${VALUE}'>${equimentPosition[1]}</span><br>`,
      );
      textDesc.push(
        `<span>ธาตุ</span> : <span class='${VALUE}'> ${equimentType[1]}</span><br>`,
      );
    } else if (f.includes("ตำแหน่ง :")) {
      const splitType = f.split("น้ำหนัก");
      const equimentPosition = splitType[0].split(":");
      const equimentWeight = (splitType[1] ?? "").split(":");
      textDesc.push(
        `<span>${equimentPosition[0]}</span>:<span class='${VALUE}'>${equimentPosition[1]}</span><br>`,
      );
      textDesc.push(
        `<span>น้ำหนัก</span> : <span class='${VALUE}'>${equimentWeight[1]}</span><br>`,
      );
    } else {
      const equimentOther = f.split(":");
      textDesc.push(
        `<span>${equimentOther[0]}</span> : <span class='${VALUE}'>${equimentOther[1]}</span><br>`,
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
  const html = parseOption(identifiedDescriptionName);

  if (!html.trim()) return null;

  return (
    <div className="w-full rounded-2xl border border-base-300 bg-base-200 p-4 shadow-sm">
      <div
        className="text-left text-sm leading-relaxed text-base-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
