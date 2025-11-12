import Image from "next/image";
import teteGuild from "../../../public/assets/images/GuildImage/vanCleef.png";
import dogGuild from "../../../public/assets/images/GuildImage/dog.jpg";
import rocFunGuild from "../../../public/assets/images/GuildImage/rocfun.png";
export default function FooterPage() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-2 py-2 bg-linear-to-r from-purple-900 via-indigo-900 to-purple-700 z-50 text-xs h-[50px]">
      <div className="flex flex-col md:flex-row  justify-around  items-center text-gray-400">
        <span className="text-[8px] xl:text-[15px] lg:text-[15px] md:text-[15px] sm:text-[10px]">
          @2025 ROC Library. All rights reserved.
        </span>

        <div className="inline-flex md:items-center">
          <div className="hidden md:flex text-[8px] xl:text-[15px] lg:text-[15px] md:text-[15px] sm:text-[10px] ">Supporter</div>
          <div className="flex justify-center mt-0">
            {[
              {
                img: teteGuild,
                label: "ลูกคุณหนูใจแตก",
              },
              {
                img: dogGuild,
                label: "หมากัดหมวด",
              },
              {
                img: rocFunGuild,
                label: "ROC หรรษา",
              },
            ].map((g, i) => (
              <div key={i} className="relative group mx-3">
                <Image
                  src={g.img}
                  alt={g.label}
                  className="w-[25px] h-[25px] md:w-[35px] md:h-[35px]"
                />
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity w-[100px] text-center">
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
