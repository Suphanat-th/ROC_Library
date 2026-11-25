"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";
import teteGuild from "../../../public/assets/images/GuildImage/vanCleef.png";
import dogGuild from "../../../public/assets/images/GuildImage/dog.jpg";
import rocFunGuild from "../../../public/assets/images/GuildImage/rocfun.png";
import { ChevronRight, ExternalLink } from "lucide-react";
import { SidebarIcon, type SidebarIconName } from "@/components/SidebarIcon";

interface FileTreeItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon?: SidebarIconName;
  tone?: Tone;
  href?: string;
  link_target?: boolean | null;
  children?: FileTreeItem[];
}

const fileTree: FileTreeItem[] = [
  {
    id: "home",
    tone: "primary",
    name: "Home",
    type: "file",
    icon: "home",
    href: "/",
  },
  {
    id: "muad",
    tone: "info",
    name: "MUAD",
    type: "file",
    icon: "muad",
    href: "/muad",
  },
  {
    id: "5thAnvs",
    tone: "accent",
    name: "5th Anniversary",
    type: "file",
    icon: "gift",
    href: "/5thAnvs",
  },
  {
    id: "features",
    tone: "primary",
    name: "Features",
    type: "folder",
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
        tone: "success",
        name: "Central Laboratory",
        type: "file",
        icon: "flask",
        href: "/central-lab",
      },
      {
        id: "monster",
        tone: "error",
        name: "Monster x3",
        type: "file",
        icon: "monster",
        href: "/monsterx3",
      },
      {
        id: "endlesstower",
        tone: "info",
        name: "Endless Tower",
        type: "file",
        icon: "tower",
        href: "/endless-tower",
      },
      {
        id: "mvp",
        tone: "error",
        name: "MVP Hunter",
        type: "file",
        icon: "skull",
        href: "/mvp",
      },
      {
        id: "aspd",
        tone: "accent",
        name: "The Flash Calc (ASPD)",
        type: "file",
        icon: "bolt",
        href: "/aspd-calc",
      },
      // {
      //   id: "cast-calc",
      //   name: "Cast Calculator",
      //   type: "file",
      //   icon: "https://api.iconify.design/fluent-emoji-flat/hourglass-not-done.svg",
      //   href: "/cast-calc",
      // },
    ],
  },
  // {
  //   id: "vip",
  //   name: "VIP Search",
  //   type: "file",
  //   icon: "🌟",
  //   href: "/vip-search"
  // },
  {
    id: "dungeon",
    tone: "success",
    name: "Dungeon",
    type: "folder",
    children: [
      {
        id: "facewormnest",
        tone: "success",
        name: "Faceworm Nest Guide",
        type: "file",
        icon: "nest",
        href: "/facewormnest-guide",
      },
      {
        id: "toyfactory",
        tone: "accent",
        name: "Toy Factory Guide",
        type: "file",
        icon: "toy",
        href: "/toyfactory-guide",
      },
      {
        id: "jittlebug",
        tone: "info",
        name: "Jittlebug",
        type: "file",
        icon: "map",
        href: "/jittlebug",
      },
      // {
      //   id: "endlesstower",
      //   name: "- Endless Tower",
      //   type: "file",
      //   icon: "🗼",
      //   href: "/endless-tower",
      // },
    ],
  },

  {
    id: "calcbp",
    tone: "accent",
    name: "Battle Pass Calculator",
    type: "file",
    icon: "ticket",
    href: "/calc-bp",
  },
  {
    id: "randomscroll",
    tone: "primary",
    name: "Random Scroll",
    type: "file",
    icon: "scroll",
    href: "/random-scroll",
  },
  // {
  //   id: "atkcalc",
  //   name: "ATK Calculator",
  //   type: "file",
  //   icon: "https://api.iconify.design/fluent-emoji-flat/crossed-swords.svg",
  //   href: "/atk-calc",
  // },
  {
    id: "donate",
    tone: "error",
    name: "Donate",
    type: "file",
    icon: "heart",
    href: "/donate",
  },
  {
    id: "say-something",
    tone: "success",
    name: "บอกเรา",
    type: "file",
    icon: "chat",
    href: "/say-something",
  },
  {
    id: "skin-game",
    tone: "info",
    name: "Skin UI",
    type: "file",
    icon: "palette",
    href: "https://drive.google.com/drive/u/0/folders/1pbN2d8I4M2cYRcuzhxrsn21nrMiX9pPw",
    link_target: true,
  },
  // {
  //   id: "aspd",
  //   name: "The Flash Calc (ASPD)",
  //   type: "file",
  //   icon: "⚡",
  //   href: "/aspd-calc",
  // },
  // {
  //   id: "expcalc",
  //   name: "Exp Calculator",
  //   type: "file",
  //   icon: "📊",
  //   href: "/exp-calc",
  // },
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

type Tone = "primary" | "info" | "success" | "accent" | "error";

/* A group's theme colour: the dot on its heading and the rail beside its Tools. Classes are spelled out so Tailwind can see them. */
const toneStyles: Record<Tone, { rail: string; dot: string }> = {
  primary: { rail: "border-primary/30", dot: "bg-primary" },
  info: { rail: "border-info/30", dot: "bg-info" },
  success: { rail: "border-success/30", dot: "bg-success" },
  accent: { rail: "border-accent/30", dot: "bg-accent" },
  error: { rail: "border-error/30", dot: "bg-error" },
};

function FileTreeNode({
  item,
  level = 0,
  toggleDrawer,
}: {
  item: FileTreeItem;
  level?: number;
  toggleDrawer: () => void;
}) {
  const { pendingHref, startNavigation } = useLoading();
  const pathname = usePathname();
  // Open the folder that holds the current Tool so the active link is visible.
  const [expanded, setExpanded] = useState(
    () => item.children?.some((child) => child.href === pathname) ?? false,
  );
  const isFolder = item.type === "folder";
  const isActive = !isFolder && item.href === pathname;
  const isPending = !isFolder && item.href === pendingHref;
  const hasActiveChild =
    isFolder && !!item.children?.some((child) => child.href === pathname);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    toggleDrawer();

    // External link / Open new tab
    if (item.link_target) {
      return;
    }

    // Normal navigation
    startNavigation(item.href || "#", event);
  };

  if (isFolder) {
    return (
      <div className="pt-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="group flex w-full items-center gap-2 rounded-field px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-base-content/60 transition-colors hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span
            aria-hidden="true"
            className={`h-2 w-2 shrink-0 rounded-full ${toneStyles[item.tone ?? "primary"].dot}`}
          />
          <span className="truncate">{item.name}</span>
          {hasActiveChild && !expanded && (
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
          <span aria-hidden="true" className="h-px flex-1 bg-base-300" />
          <ChevronRight
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-90" : ""}`}
          />
        </button>
        {expanded && (
          <div className={`mt-1 ml-7 space-y-0.5 border-l-2 pl-2 ${toneStyles[item.tone ?? "primary"].rail}`}>
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
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={handleLinkClick}
      title={item.name}
      target={item.link_target ? "_blank" : undefined}
      rel={item.link_target ? "noopener noreferrer" : undefined}
      aria-current={isActive ? "page" : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-field py-2 pr-3 pl-3 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-primary ${
        isActive || isPending
          ? "bg-primary/10 font-semibold text-primary"
          : "text-base-content/85 hover:bg-base-200 hover:text-base-content"
      }`}
    >
      {(isActive || isPending) && (
        <span
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-full bg-primary"
        />
      )}
      {item.icon && <SidebarIcon name={item.icon} active={isActive || isPending} />}
      <span className="truncate">{item.name}</span>
      {isPending && (
        <span
          className="loading loading-spinner loading-xs ml-auto shrink-0"
          aria-hidden="true"
        />
      )}
      {item.link_target && !isPending && (
        <ExternalLink
          aria-hidden="true"
          className="ml-auto h-3.5 w-3.5 shrink-0 text-base-content/40 group-hover:text-base-content/70"
        />
      )}
    </Link>
  );
}

const supporters = [
  { img: teteGuild, label: "ลูกคุณหนูใจแตก" },
  { img: dogGuild, label: "หมากัดหมวด" },
  { img: rocFunGuild, label: "ROC หรรษา" },
];

export default function SidebarPage() {
  const closeDrawer = () => {
    const checkbox = document.getElementById(
      "is-drawer-open",
    ) as HTMLInputElement | null;
    if (checkbox) checkbox.checked = false;
  };

  return (
    <>
      {/* Spacer: the Navbar (z-40) stays above the Sidebar so the Menu toggle can close it */}
      <div aria-hidden="true" className="h-16 shrink-0" />

      {/* Sidebar Navigation */}
      <nav aria-label="เมนูหลัก" className="flex-1 overflow-y-auto px-3 pt-4 pb-4">
        <div className="space-y-0.5">
          {fileTree.map((item) => (
            <FileTreeNode key={item.id} item={item} toggleDrawer={closeDrawer} />
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto shrink-0 border-t border-base-300 bg-base-200 px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/60">
          Supporter
        </p>
        <ul className="flex items-center gap-2">
          {supporters.map((g) => (
            <li key={g.label} className="tooltip tooltip-top" data-tip={g.label}>
              <Image
                src={g.img}
                alt={g.label}
                width={32}
                height={32}
                className="h-8 w-8 rounded-field border-2 border-base-100 object-cover"
              />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-base-content/60">
          © 2025 ROC Library. All rights reserved.
        </p>
      </div>
    </>
  );
}
