function parseDetail(text: string[]): string {
  if (!text) return "";
  const textDesc: string[] = [];
  const redColor = "^ff0000";
  for (let f of text) {
    const str = f.split(redColor);
    f =
      str.length > 1 ? `<span class="text-[#ff0000]">${str[1]}</span>` : str[0];
    if (f === "") {
      f =
        "___________________________________________________________________________";
    }
    if (f.includes("ประเภท")) {
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
    <div className="col-span-6 sm:col-span-4 bg-white/95 p-6 rounded-2xl shadow-md text-gray-800 space-y-4 border border-gray-100 text-left">
      <div className="bg-white/95 p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-orange-500 font-extrabold text-xl mb-3 border-b border-orange-200 pb-1">
          รายละเอียด
        </h2>

        <div
          className="text-sm text-gray-800 leading-7 text-left space-y-2 break-words"
          dangerouslySetInnerHTML={{ __html: parseDetail(identifiedDescription) }}
        />
      </div>
    </div>
  );
}
