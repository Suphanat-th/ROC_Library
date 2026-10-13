// RO colour codes are written for the game's dark tooltip. The card is light,
// so each one maps to a darker shade of the same hue that stays readable.
const RO_COLOR_CLASS: Record<string, string> = {
  ff0000: "text-[#c80000]",
  b4b4b4: "text-[#6b6b6b]",
  "00ff00": "text-[#0b7a0b]",
  ffff00: "text-[#8a6d00]",
  "32CD32": "text-[#1b7f1b]",
  "4D4DFF": "text-[#3333cc]",
  "000088": "text-[#000088]",
  CC3D3D: "text-[#b02f2f]",
  "ffffff_": "text-base-content",
};

function parseDetail(text: string[]): string {
  if (!text) return "";
  const textDesc: string[] = [];

  for (let f of text) {
    // A grey segment keeps only the text after its marker.
    const gray = f.split("^b4b4b4");
    if (gray.length > 1) {
      f = `<span class="${RO_COLOR_CLASS.b4b4b4}">${gray[1]}</span>`;
    }

    if (f === "" || f === "_") {
      textDesc.push('<hr class="my-2 border-base-300" />');
      continue;
    }

    // RO colour codes -> HTML
    f = f
      .replace(/\^start_L/g, `<span class="${RO_COLOR_CLASS.ff0000} line-through mr-2">`)
      .replace(/\^end_L/g, `</span>`);
    for (const [code, cls] of Object.entries(RO_COLOR_CLASS)) {
      f = f.replace(new RegExp(`\\^${code}`, "g"), `<span class="${cls}">`);
    }

    // Close any span opened by a colour code at the end of the line.
    if (f.includes("<span")) {
      f += "</span>";
    }

    if (f.includes("ประเภท :")) {
      break;
    }
    textDesc.push(f + "<br>");
  }
  return textDesc.join("");
}

export default function DetailConvertPage({
  identifiedDescription,
}: {
  identifiedDescription: string[];
}) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-4 text-left text-base-content shadow-md @lg:p-6">
      <h3 className="mb-3 border-b border-orange-200 pb-1 text-xl font-extrabold text-orange-700">
        รายละเอียด
      </h3>

      <div
        className="wrap-break-word text-sm leading-7 text-base-content"
        dangerouslySetInnerHTML={{
          __html: parseDetail(identifiedDescription),
        }}
      />
    </section>
  );
}
