"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";
import teteGuild from "../../../public/assets/images/GuildImage/vanCleef.png";
import dogGuild from "../../../public/assets/images/GuildImage/dog.jpg";
import rocFunGuild from "../../../public/assets/images/GuildImage/rocfun.png";
import { ArrowUpRight, ExternalLink, Heart, Search, X } from "lucide-react";
import { SidebarIcon, type SidebarIconName } from "@/components/SidebarIcon";
import { useMember } from "@/utils/useMember";
import { ThemeSwitch } from "@/components/ThemeToggle";
import AccountArea from "@/layout/navbar/AccountArea";
import logo from "../../../public/assets/images/web/Logo.png";

interface FileTreeItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon?: SidebarIconName;
  tone?: Tone;
  href?: string;
  link_target?: boolean | null;
  /** Listed only while a Member is signed in on this device. */
  membersOnly?: boolean;
  /** Gets a section of its own, with a full-width tile. */
  solo?: boolean;
  /** Gathers with the other items of the same group name into one section. */
  group?: string;
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
    solo: true,
  },
  {
    id: "patch-convert",
    tone: "info",
    name: "Patch Convert",
    type: "file",
    icon: "scroll",
    href: "/patch-convert",
    membersOnly: true,
  },
  {
    id: "costume",
    tone: "info",
    name: "Simulator Costume ROC",
    type: "file",
    icon: "scroll",
    href: "/costume",
    membersOnly: true,
  },
  {
    id: "cast-calc",
    tone: "info",
    name: "Cast Calculator",
    type: "file",
    icon: "hourglass",
    href: "/cast-calc",
    membersOnly: true,
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
    group: "Community",
    type: "file",
    icon: "heart",
    href: "/donate",
  },
  {
    id: "say-something",
    tone: "success",
    name: "บอกเรา",
    group: "Community",
    type: "file",
    icon: "chat",
    href: "/say-something",
  },
  {
    id: "skin-game",
    tone: "info",
    name: "Skin UI",
    group: "Community",
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

/* Each section has its own hue (tokens --sec-* in globals.css, tuned for light and dark). Inside a section
   --color-primary is pointed at that hue, so its number, rule, icon sockets, glow and corner ticks all follow it. */
function hueOf(id: string) {
  if (id === "member") return "amber";
  if (id === "features") return "violet";
  if (id === "dungeon") return "green";
  if (id.startsWith("group-")) return "rose";
  if (id.startsWith("loose-")) return "orange";
  return "blue";
}


/* One line under each Tool's name, so a player can tell what a tile does before opening it. */
const toolDesc: Record<string, string> = {
  home: "สถานะ Server และอีเวนต์ล่าสุด",
  muad: "เซ็ตอุปกรณ์ของหมากัดหมวด",
  "5thAnvs": "อีเวนต์ครบรอบ 5 ปี",
  "patch-convert": "แปลงข้อมูลแพตช์ (สำหรับ Member)",
  costume: "ลองแต่งตัวละคร อาชีพ ผม สี และ Costume (สำหรับ Member)",
  "cast-calc": "คำนวณเวลาร่ายสกิล Fixed cast / VCT / Delay (สำหรับ Member)",
  lab: "รหัสเข้าห้องแล็บกลางประจำวัน",
  monster: "มอนสเตอร์ EXP/JOB x3 ของรอบนี้",
  endlesstower: "ข้อมูล Endless Tower",
  mvp: "จับเวลา MVP / Mini boss พร้อมเส้นทาง",
  aspd: "คำนวณความเร็วโจมตี (ASPD)",
  facewormnest: "คู่มือดันเจี้ยน Faceworm Nest",
  toyfactory: "คู่มือดันเจี้ยน Toy Factory",
  jittlebug: "แผนที่ดันเจี้ยน Jittlebug",
  calcbp: "คำนวณ Battle Pass",
  randomscroll: "จำลองการสุ่ม Scroll",
  donate: "สนับสนุนผู้พัฒนา",
  "say-something": "ส่งข้อความถึงผู้พัฒนา",
  "skin-game": "ไฟล์ Skin UI บน Google Drive",
};

type Section = { id: string; name: string; tone: Tone; items: FileTreeItem[]; solo?: boolean };

/* A solo Tool (Home), the Member-only Tools (Patch Convert, Costume simulator) together as "Member", each folder and each named group (Community) become their own section; the remaining loose Tools gather into "More", in the order listed. */
function toSections(items: FileTreeItem[]): Section[] {
  const sections: Section[] = [];
  let loose: Section | null = null;
  for (const item of items) {
    if (item.type === "folder") {
      sections.push({ id: item.id, name: item.name, tone: item.tone ?? "primary", items: item.children ?? [] });
      loose = null;
    } else if (item.membersOnly) {
      // Every Member-only Tool sits in the one "Member" section.
      let member = sections.find((x) => x.id === "member");
      if (!member) {
        member = { id: "member", name: "Member", tone: item.tone ?? "info", items: [] };
        sections.push(member);
      }
      member.items.push(item);
      loose = null;
    } else if (item.group) {
      let grouped = sections.find((x) => x.id === `group-${item.group}`);
      if (!grouped) {
        grouped = { id: `group-${item.group}`, name: item.group, tone: item.tone ?? "accent", items: [] };
        sections.push(grouped);
      }
      grouped.items.push(item);
      loose = null;
    } else if (item.solo) {
      sections.push({ id: item.id, name: "Start", tone: item.tone ?? "primary", items: [item], solo: true });
      loose = null;
    } else {
      if (!loose) {
        loose = { id: `loose-${sections.length}`, name: "More", tone: "primary", items: [] };
        sections.push(loose);
      }
      loose.items.push(item);
    }
  }
  return sections;
}

function closeMenu() {
  const flip = document.getElementById("sidebar-flip") as HTMLInputElement | null;
  if (flip) flip.checked = false;
}

/* One Tool as a module: icon socket, name, one-line purpose, and an index code (section.line). */
function MenuTile({
  item,
  index,
  code,
  first,
}: {
  item: FileTreeItem;
  index: number;
  code: string;
  /** The first search result: Enter opens it. */
  first: boolean;
}) {
  const { pendingHref, startNavigation } = useLoading();
  const pathname = usePathname();
  const isActive = item.href === pathname;
  const isPending = item.href === pendingHref;
  const lit = isActive || isPending;

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    // External link / Open new tab
    if (item.link_target) return;
    startNavigation(item.href || "#", event);
  };

  return (
    <Link
      href={item.href || "#"}
      onClick={handleLinkClick}
      target={item.link_target ? "_blank" : undefined}
      rel={item.link_target ? "noopener noreferrer" : undefined}
      aria-current={isActive ? "page" : undefined}
      data-tool=""
      style={{ "--i": index } as React.CSSProperties}
      className={`hud-item hud-in group relative flex items-center gap-3.5 rounded-box border-primary/20 bg-base-100/75 p-3 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-primary ${
        lit ? "hud-item-active bg-primary/10" : ""
      } ${first ? "hud-item-first" : ""}`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-field border ${
          lit ? "border-primary/60 bg-primary/15" : "border-primary/35 bg-primary/10 group-hover:border-primary/60"
        }`}
      >
        {item.icon && <SidebarIcon name={item.icon} active={lit} className="h-7 w-7" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[0.95rem] font-semibold ${lit ? "text-primary" : "text-base-content group-hover:text-primary"}`}>
          {item.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-base-content/60">{toolDesc[item.id]}</span>
      </span>
      <span className="hud-mono flex shrink-0 flex-col items-end gap-1.5 self-stretch text-[0.65rem] tracking-wider">
        <span className="text-base-content/40">{code}</span>
        {isPending ? (
          <span className="loading loading-spinner loading-xs text-primary" aria-hidden="true" />
        ) : item.link_target ? (
          <ExternalLink aria-hidden="true" className="mt-auto h-3.5 w-3.5 text-base-content/40 group-hover:text-primary" />
        ) : isActive ? (
          <span className="mt-auto flex items-center gap-1 font-semibold uppercase text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_currentColor]" />
            ที่นี่
          </span>
        ) : (
          <ArrowUpRight aria-hidden="true" className="mt-auto h-3.5 w-3.5 -translate-x-1 translate-y-1 text-primary opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        )}
      </span>
    </Link>
  );
}

const supporters = [
  { img: teteGuild, label: "ลูกคุณหนูใจแตก" },
  { img: dogGuild, label: "หมากัดหมวด" },
  { img: rocFunGuild, label: "ROC หรรษา" },
];

export default function SidebarPage() {
  const { signedIn } = useMember();
  const { startNavigation } = useLoading();
  const [query, setQuery] = useState("");
  const items = fileTree.filter((item) => signedIn || !item.membersOnly);

  // Esc closes the menu; opening it puts the cursor in the search box.
  useEffect(() => {
    const flip = document.getElementById("sidebar-flip") as HTMLInputElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && flip?.checked) flip.checked = false;
    };
    const onChange = () => {
      if (flip?.checked) document.getElementById("sidebar-search")?.focus();
      else setQuery("");
    };
    document.addEventListener("keydown", onKey);
    flip?.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      flip?.removeEventListener("change", onChange);
    };
  }, []);

  const q = query.trim().toLowerCase();
  const all = toSections(items);
  const total = all.reduce((n, s) => n + s.items.length, 0);
  const sections = all
    .map((s, i) => ({ ...s, number: i + 1, items: s.items.filter((t) => !q || t.name.toLowerCase().includes(q) || (toolDesc[t.id] ?? "").toLowerCase().includes(q)) }))
    .filter((s) => s.items.length > 0);
  const found = sections.reduce((n, s) => n + s.items.length, 0);
  let line = 0;

  // Enter opens the first match, so a player can type a few letters and go.
  const openFirst = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !q) return;
    document.querySelector<HTMLAnchorElement>("#sidebar-tools a[data-tool]")?.click();
  };

  return (
    <>
      {/* Head: brand, the player's controls (support, colour mode, account), and the way out */}
      <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-primary/25 px-4 py-3 sm:px-8">
        <Link
          href="/"
          onClick={(e) => {
            closeMenu();
            startNavigation("/", e);
          }}
          className="flex items-center gap-2 rounded-field px-1 transition-colors hover:text-primary"
        >
          <Image src={logo} alt="ROC Library Logo" width={40} height={40} className="object-contain" />
          <span className="text-lg font-semibold">
            ROC <span className="text-primary">Library</span>
          </span>
        </Link>
        <label
          htmlFor="sidebar-flip"
          className="btn btn-ghost btn-sm order-2 ml-auto cursor-pointer gap-2 border border-primary/25 text-base-content/80 hover:border-primary/60 hover:text-primary lg:order-3 lg:ml-0"
          aria-label="Close menu"
        >
          <span className="hud-mono hidden text-[0.65rem] tracking-wider text-base-content/50 sm:inline">ESC</span>
          <X aria-hidden="true" className="h-5 w-5" />
        </label>
        <div className="order-3 flex w-full flex-wrap items-center gap-2 lg:order-2 lg:ml-auto lg:w-auto lg:justify-end">
          <Link
            href="/donate"
            onClick={(e) => {
              closeMenu();
              startNavigation("/donate", e);
            }}
            style={{ "--color-primary": "var(--sec-rose)" } as React.CSSProperties}
            className="btn btn-sm gap-1.5 border-primary/50 bg-primary/10 text-primary hover:border-primary hover:bg-primary/20"
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
            สนับสนุน
          </Link>
          <ThemeSwitch />
          <AccountArea />
        </div>
      </div>

      {/* Tools */}
      <nav aria-label="เมนูหลัก" className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Title + search: the one thing most visits come here to do */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="hud-mono text-xs uppercase tracking-[0.25em] text-primary">Menu index</p>
              <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
                เลือกเมนู <span className="text-primary">ที่ต้องการ</span>
              </h1>
            </div>
            <div className="w-full lg:max-w-md">
              <label className="hud-search input flex h-12 w-full items-center gap-3 bg-base-100/80">
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                <input
                  id="sidebar-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={openFirst}
                  placeholder="พิมพ์ชื่อเมนูแล้วกด Enter"
                  aria-label="ค้นหาเมนู"
                  className="grow"
                  autoComplete="off"
                />
                <span className="hud-mono shrink-0 text-[0.65rem] tracking-wider text-base-content/50" aria-live="polite">
                  {q ? `${found}/${total}` : `${total} MENUS`}
                </span>
              </label>
            </div>
          </div>

          <div id="sidebar-tools" className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.id}
                aria-label={section.name}
                style={{ "--color-primary": `var(--sec-${hueOf(section.id)})` } as React.CSSProperties}
                className="grid items-start gap-3 lg:grid-cols-[11rem_1fr] lg:gap-6"
              >
                {/* Section rail: number, name, count */}
                <h2
                  className="hud-in flex items-baseline gap-3 lg:flex-col lg:gap-1 lg:border-t-2 lg:border-primary/40 lg:pt-3"
                  style={{ "--i": line++ } as React.CSSProperties}
                >
                  <span className="hud-mono text-3xl font-semibold leading-none text-primary sm:text-4xl">
                    {String(section.number).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
                    <span aria-hidden="true" className={`h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] bg-primary`} />
                    {section.name}
                  </span>
                  <span className="hud-mono text-[0.65rem] tracking-wider text-base-content/50">{section.items.length} {section.items.length === 1 ? "MENU" : "MENUS"}</span>
                </h2>
                <div className={`grid grid-cols-1 gap-3 ${section.solo ? "" : "md:grid-cols-2 xl:grid-cols-3"}`}>
                  {section.items.map((tool, ti) => (
                    <MenuTile
                      key={tool.id}
                      item={tool}
                      index={line++}
                      code={`${String(section.number).padStart(2, "0")}.${ti + 1}`}
                      first={!!q && section.number === sections[0].number && ti === 0}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {sections.length === 0 && (
            <p className="hud-mono py-16 text-center text-base-content/60">
              ไม่พบเมนูที่ตรงกับ &quot;{query}&quot;
            </p>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-t border-primary/25 bg-base-200/80 px-4 py-3 pr-16 sm:px-8 sm:pr-20">
        <p className="hud-mono text-xs font-semibold uppercase tracking-widest text-primary/80">Supporter</p>
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
        <p className="text-xs text-base-content/60 sm:ml-auto">© 2025 ROC Library. All rights reserved.</p>
      </div>
    </>
  );
}
