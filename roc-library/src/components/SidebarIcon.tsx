/* Sidebar icons: one hand-inked set.
   Every icon is a closed `body` plus open `details`. The line is drawn in ink (round, slightly soft),
   and the body is filled once more with the theme's primary colour, shifted a hair down and right,
   like a print where the colour plate sits off register. The set is drawn on a 24-unit grid. */

type Drawing = { body: string; details?: string };

const drawings = {
  home: {
    body: "M4.5 11.2 12 4.6l7.5 6.6v8.4a.8.8 0 0 1-.8.8H5.3a.8.8 0 0 1-.8-.8Z",
    details: "M3.4 11.8 12 4.2l8.6 7.6M10 20.4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5",
  },
  muad: {
    body: "M16.4 3.6l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z",
    details: "M13.6 10 4.6 19M5.8 15.6l2.6 2.6M19.2 13.4v3M17.7 14.9h3",
  },
  gift: {
    body: "M4.6 11.2h14.8v8.4a.9.9 0 0 1-.9.9h-13a.9.9 0 0 1-.9-.9Z",
    details:
      "M3.6 7.8h16.8v3.4H3.6ZM12 7.8v12.7M12 7.8C10.6 4.6 7.2 4.7 7.6 6.4c.3 1.2 2.6 1.4 4.4 1.4Zm0 0c1.4-3.2 4.8-3.1 4.4-1.4-.3 1.2-2.6 1.4-4.4 1.4Z",
  },
  flask: {
    body: "M10.4 9.4 5.2 18.2c-.8 1.4.1 3 1.7 3h10.2c1.6 0 2.5-1.6 1.7-3l-5.2-8.8Z",
    details: "M9.2 3.8h5.6M10.4 3.8v5.6M13.6 3.8v5.6M8.4 16.2h7.2",
  },
  monster: {
    body: "M5 19.8V11.4a7 7 0 0 1 14 0v8.4l-2.3-1.7-2.4 1.7-2.3-1.7-2.3 1.7-2.4-1.7Z",
    details: "M9.6 11.6h.01M14.4 11.6h.01M7.4 6.2 5.8 3.4M16.6 6.2l1.6-2.8M10.4 15h3.2",
  },
  tower: {
    body: "M8.6 21.2V9h6.8v12.2Z",
    details:
      "M6.9 9h10.2M7.3 9V4.6h2.2v1.8h1.6V4.6h1.8v1.8h1.6V4.6h2.2V9M5.4 21.2h13.2M11 21.2v-3.4a1 1 0 0 1 2 0v3.4",
  },
  skull: {
    body: "M5.2 11.2C5.2 7 8.2 4.4 12 4.4s6.8 2.6 6.8 6.8c0 2.4-1 3.8-2.4 4.8v2.6a.9.9 0 0 1-.9.9H8.5a.9.9 0 0 1-.9-.9V16c-1.4-1-2.4-2.4-2.4-4.8Z",
    details: "M9.5 11.4h.01M14.5 11.4h.01M10.6 19.6v-2M13.4 19.6v-2M12 14.2h.01",
  },
  bolt: {
    body: "M13.4 3 5.8 13.6h5.2l-1 7.4 7.6-10.8h-5.2Z",
    details: "M3.6 8.6h3M2.8 12h2.4",
  },
  nest: {
    body: "M4 14.8h16c-.7 3.8-3.8 5.8-8 5.8s-7.3-2-8-5.8Z",
    details: "M7.4 12.4c-.4-2.8 2-3.8 3.4-2.4s2.4 2.8 4 1.6c1.4-1 1.5-2.8.3-4M15.6 5.8h.01",
  },
  toy: {
    body: "M4 9.6h16v9.2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z",
    details:
      "M7.6 9.6V7.8a1.1 1.1 0 0 1 1.1-1.1h.8a1.1 1.1 0 0 1 1.1 1.1v1.8M13.4 9.6V7.8a1.1 1.1 0 0 1 1.1-1.1h.8a1.1 1.1 0 0 1 1.1 1.1v1.8M8 14.2h8",
  },
  map: {
    body: "M3.8 6.6 9 4.8l6 2.1 5.2-1.8v12.5L15 19.4l-6-2.1-5.2 1.8Z",
    details: "M9 4.8v12.5M15 6.9v12.5",
  },
  ticket: {
    body: "M3.8 8.8a1 1 0 0 1 1-1h14.4a1 1 0 0 1 1 1V10a2.1 2.1 0 0 0 0 4.1v1.2a1 1 0 0 1-1 1H4.8a1 1 0 0 1-1-1v-1.2a2.1 2.1 0 0 0 0-4.1Z",
    details: "M14.6 8v1.5M14.6 11.3v1.5M14.6 14.6v1.5",
  },
  scroll: {
    body: "M7.2 4.6h10a1.8 1.8 0 0 1 1.8 1.8v11.8a1.8 1.8 0 0 1-1.8 1.8H7.2Z",
    details:
      "M7.2 4.6C5.8 4.6 5 5.4 5 6.5s.7 1.8 1.8 1.8h.4M7.2 20c-1.3 0-2.2-.7-2.2-1.7M9.8 9.6h6M9.8 12.6h6M9.8 15.6h3.6",
  },
  heart: {
    body: "M12 20.2C6.2 16.2 3.6 12.9 3.6 9.5a4.3 4.3 0 0 1 8.4-1.4 4.3 4.3 0 0 1 8.4 1.4c0 3.4-2.6 6.7-8.4 10.7Z",
  },
  chat: {
    body: "M4 6.6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2h-6.4l-4 3.6v-3.6H6a2 2 0 0 1-2-2Z",
    details: "M8.4 9.6h7.2M8.4 12.6h4.4",
  },
  palette: {
    body: "M12 3.8c-4.6 0-8.2 3.4-8.2 7.8s3.6 8.6 8.2 8.6c1.3 0 1.9-.8 1.9-1.6 0-1.4-1-1.6-1-2.8 0-1 .8-1.6 1.8-1.6h2.2c2 0 3.5-1.4 3.5-3.4 0-3.6-3.6-6.6-8.4-6.6Z",
    details: "M7.8 11h.01M10.2 7.6h.01M14.4 7.6h.01M17 10.8h.01",
  },
} satisfies Record<string, Drawing>;

export type SidebarIconName = keyof typeof drawings;

export function SidebarIcon({
  name,
  active = false,
  className = "h-6 w-6",
}: {
  name: SidebarIconName;
  active?: boolean;
  className?: string;
}) {
  const { body, details } = drawings[name] as Drawing;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} shrink-0 overflow-visible`}
    >
      {/* Colour plate: sits off register, and settles into place on hover or focus. */}
      <g className="translate-x-[1.4px] translate-y-[1.4px] transition-transform duration-200 motion-reduce:transition-none group-hover:translate-x-[0.4px] group-hover:translate-y-[0.4px] group-focus-visible:translate-x-[0.4px] group-focus-visible:translate-y-[0.4px]">
        <path
          d={body}
          className={`transition-colors motion-reduce:transition-none ${active ? "fill-primary/45" : "fill-primary/25"}`}
        />
      </g>
      {/* Ink line */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={body} />
        {details && <path d={details} />}
      </g>
    </svg>
  );
}
