"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import teteGuild from "../../../public/assets/images/GuildImage/vanCleef.png";
import dogGuild from "../../../public/assets/images/GuildImage/dog.jpg";
import rocFunGuild from "../../../public/assets/images/GuildImage/rocfun.png";
import logo from "../../../public/assets/images/web/Logo.png";

interface FileTreeItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon?: string;
  href?: string;
  children?: FileTreeItem[];
}

const fileTree: FileTreeItem[] = [
  {
    id: "home",
    name: "Home",
    type: "file",
    icon: "🏠",
    href: "/"
  },
  {
    id: "features",
    name: "Features",
    type: "folder",
    icon: "⭐",
    children: [
      // {
      //   id: "classes",
      //   name: "Classes Stone",
      //   type: "file",
      //   icon: "💎",
      //   href: "/classes-stone"
      // },
      {
        id: "lab",
        name: "Monster Lab",
        type: "file",
        icon: "🔬",
        href: "/central-lab"
      },
      {
        id: "monster",
        name: "Monster x3",
        type: "file",
        icon: "👹",
        href: "/monsterx3"
      }
    ]
  },{
    id: "muad",
    name: "MUAD",
    type: "file",
    icon: "🐕",
    href: "/muad"
  },
  // {
  //   id: "tools",
  //   name: "Tools",
  //   type: "folder",
  //   icon: "🛠️",
  //   children: [
  //     {
  //       id: "muad",
  //       name: "MUAD",
  //       type: "file",
  //       icon: "⚙️",
  //       href: "/muad"
  //     },
  //     {
  //       id: "patch",
  //       name: "Patch Convert",
  //       type: "file",
  //       icon: "📦",
  //       href: "/patch-convert"
  //     },
  //     {
  //       id: "visual",
  //       name: "Visual",
  //       type: "file",
  //       icon: "👁️",
  //       href: "/visual"
  //     }
  //   ]
  // }
];

function FileTreeNode({ 
  item, 
  level = 0,
  toggleDrawer
}: { 
  item: FileTreeItem; 
  level?: number;
  toggleDrawer: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = item.type === "folder";

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      toggleDrawer();
    }
  };

  return (
    <div key={item.id}>
      {isFolder ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            title={item.name}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors text-white text-sm"
          >
            <span className="mr-2 text-base w-5 text-center shrink-0">
              {expanded ? "▼" : "▶"}
            </span>
            <span className="text-base mr-2 shrink-0">{item.icon}</span>
            <span className="truncate">{item.name}</span>
          </button>
          {expanded && (
            <div className="pl-4">
              {item.children?.map((child) => (
                <FileTreeNode 
                  key={child.id} 
                  item={child} 
                  level={level + 1}
                  toggleDrawer={toggleDrawer}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href || "#"}
          onClick={closeSidebarOnMobile}
          title={item.name}
          className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors text-white text-sm w-full"
        >
          <span className="w-5 shrink-0"></span>
          <span className="text-base mr-2 shrink-0">{item.icon}</span>
          <span className="truncate">{item.name}</span>
        </Link>
      )}
    </div>
  );
}

export default function SidebarPage() {
  return (
    <>
      {/* Sidebar Header */}
      <div className="border-b-2 border-blue-700 bg-blue-700 flex items-center justify-center h-17.5 shrink-0">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src={logo}
            alt="ROC Library Logo"
            width={50}
            height={50}
            className="object-contain drop-shadow-lg"
            priority
          />
        </Link>
      </div>

      {/* Sidebar Navigation - File Tree */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {fileTree.map((item) => (
            <FileTreeNode 
              key={item.id} 
              item={item}
              toggleDrawer={() => {
                const checkbox = document.getElementById('is-drawer-open') as HTMLInputElement;
                if (checkbox) checkbox.checked = false;
              }}
            />
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t-2 border-blue-700 bg-blue-700 mt-auto shrink-0">
        <p className="text-[10px] text-white mb-3">
          © 2025 ROC Library. All rights reserved.
        </p>
        <p className="text-[10px] font-semibold text-white mb-2">Supporter</p>
        <div className="flex justify-center gap-2">
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
            <div key={i} className="relative group">
              <Image
                src={g.img}
                alt={g.label}
                className="w-6.25 h-6.25 rounded border-2 border-white hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-8px text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {g.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
