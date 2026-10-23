"use client";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface Piece {
  src: string;
  /** position and width inside the scene, in % of the scene */
  className: string;
  /** how far it drifts while the hero scrolls away: bigger = faster, 0 = stays */
  depth: number;
  /** seconds for one float cycle */
  duration: number;
  tilt: number;
  /** clouds sit behind, drift sideways and do not tilt */
  cloud?: boolean;
}

const BASE = "/assets/images/anvs/landing";

const PIECES: Piece[] = [
  { src: `${BASE}/cloud.svg`, className: "left-[-6%] top-[8%] w-[46%] opacity-90", depth: 0.2, duration: 9, tilt: 0, cloud: true },
  { src: `${BASE}/cloud.svg`, className: "right-[-8%] bottom-[26%] w-[40%] opacity-80", depth: 0.3, duration: 11, tilt: 0, cloud: true },
  { src: `${BASE}/balloon.svg`, className: "left-[52%] top-[0%] w-[34%]", depth: 1, duration: 5.5, tilt: 4 },
  { src: `${BASE}/party-hat.svg`, className: "left-[24%] top-[10%] w-[18%]", depth: 0.7, duration: 5.2, tilt: 6 },
  { src: `${BASE}/coin.svg`, className: "left-[4%] top-[36%] w-[16%]", depth: 0.9, duration: 3.8, tilt: 10 },
  { src: `${BASE}/gift.svg`, className: "left-[16%] bottom-[2%] w-[28%]", depth: 0.5, duration: 4.6, tilt: 5 },
  { src: `${BASE}/star.svg`, className: "left-[46%] bottom-[8%] w-[11%]", depth: 0.4, duration: 4.2, tilt: 12 },
  { src: `${BASE}/ticket.svg`, className: "right-[2%] bottom-[10%] w-[30%]", depth: 0.7, duration: 5, tilt: 7 },
  { src: `${BASE}/streamer.svg`, className: "right-[6%] top-[4%] w-[11%]", depth: 0.8, duration: 6, tilt: 3 },
];

function FloatingPiece({
  piece,
  index,
  progress,
}: {
  piece: Piece;
  index: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  // the outer layer parallaxes with the scroll, the inner one floats on its own
  const y = useTransform(progress, [0, 1], [0, -piece.depth * 90]);
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${piece.className}`}
      style={reduce ? undefined : { y }}
      initial={reduce ? false : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25 + index * 0.1, type: "spring", stiffness: 120, damping: 12 }}
    >
      <motion.img
        src={piece.src}
        alt=""
        className="h-auto w-full drop-shadow-lg"
        animate={
          reduce
            ? undefined
            : piece.cloud
              ? { x: [0, 28, 0] }
              : { y: [0, -14, 0], rotate: [-piece.tilt, piece.tilt, -piece.tilt] }
        }
        transition={{ duration: piece.duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
      />
    </motion.div>
  );
}

/** The Hero's picture: props composed in one box, so they never run into the title. They carry no information. */
export default function FloatingArt({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="relative mx-auto aspect-5/4 w-full max-w-lg">
      {PIECES.map((piece, i) => (
        <FloatingPiece key={`${piece.src}-${i}`} piece={piece} index={i} progress={progress} />
      ))}
    </div>
  );
}
