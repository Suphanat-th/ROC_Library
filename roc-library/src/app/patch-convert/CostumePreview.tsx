"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Pause,
  Play,
  X,
} from "lucide-react";
import {
  costumePreviewUrls,
  hasCostumeSprite,
  PreviewGender,
} from "@/data/costumePreview";
import {
  Character,
  drawCharacter,
  isHeldPose,
  loadSpriteAsset,
  measureCharacter,
} from "@/utils/spriteComposer";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 340;
const PADDING = 12;
/** Ordinary headgear is drawn at this size; large effects shrink to fit instead. */
const MAX_SCALE = 2.5;

const GENDERS: { value: PreviewGender; label: string }[] = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

/** An ACT holds 8 directions for each pose: action = pose type × 8 + direction. */
const POSES = [
  { type: 0, label: "ยืน (Idle)" },
  { type: 2, label: "นั่ง (Sit)" },
];

/** Direction 0 faces the viewer; each step turns the character towards the viewer's left. */
const DIRECTIONS = [
  "หน้า",
  "หน้าซ้าย",
  "ซ้าย",
  "หลังซ้าย",
  "หลัง",
  "หลังขวา",
  "ขวา",
  "หน้าขวา",
];

const ALL_ACTIONS = POSES.flatMap((p) =>
  DIRECTIONS.map((_, d) => p.type * 8 + d),
);

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; character: Character };

async function loadCharacter(
  patchKey: string,
  gender: PreviewGender,
): Promise<Character> {
  const url = costumePreviewUrls(patchKey, gender);
  const [body, head, gear] = await Promise.all([
    loadSpriteAsset(url.body),
    loadSpriteAsset(url.head, url.hair),
    loadSpriteAsset(url.gear),
  ]);
  return { body, head, gear };
}

function PreviewCanvas({
  patchKey,
  gender,
  action,
  playing,
  onTogglePlay,
}: {
  patchKey: string;
  gender: PreviewGender;
  action: number;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Milliseconds into the animation, kept so a pause resumes where it stopped. */
  const pausedAt = useRef(0);
  const [state, setState] = useState<{
    key: string;
    value: LoadState;
  }>({ key: "", value: { status: "loading" } });
  const key = `${patchKey}:${gender}`;

  useEffect(() => {
    let cancelled = false;
    loadCharacter(patchKey, gender)
      .then((character) => {
        if (!cancelled)
          setState({ key, value: { status: "ready", character } });
      })
      .catch(() => {
        if (!cancelled) setState({ key, value: { status: "error" } });
      });
    return () => {
      cancelled = true;
    };
  }, [patchKey, gender, key]);

  const current: LoadState =
    state.key === key ? state.value : { status: "loading" };
  const character = current.status === "ready" ? current.character : null;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !character) return;

    // Fit everything any pose and direction paints, effects included, inside the
    // canvas, so turning or changing pose never rescales the picture.
    const bounds = measureCharacter(character, ALL_ACTIONS);
    const width = bounds ? bounds.maxX - bounds.minX : 1;
    const height = bounds ? bounds.maxY - bounds.minY : 1;
    const scale = Math.min(
      MAX_SCALE,
      (CANVAS_WIDTH - PADDING * 2) / width,
      (CANVAS_HEIGHT - PADDING * 2) / height,
    );
    const centreX = ((bounds?.minX ?? 0) + (bounds?.maxX ?? 0)) / 2;
    const centreY = ((bounds?.minY ?? 0) + (bounds?.maxY ?? 0)) / 2;
    const originX = CANVAS_WIDTH / 2 - scale * centreX;
    const originY = CANVAS_HEIGHT / 2 - scale * centreY;

    const bodyAction = character.body.act.actions[action];
    const held = isHeldPose(character.body, action);

    const paint = (elapsed: number) => {
      const bodyFrame = held
        ? 0
        : Math.floor(elapsed / bodyAction.delay) % bodyAction.frames.length;
      drawCharacter(
        ctx,
        character,
        { action, bodyFrame, elapsed },
        originX,
        originY,
        scale,
      );
    };

    // Paused: hold the moment it stopped at.
    if (!playing) {
      paint(pausedAt.current);
      return;
    }

    const start = performance.now() - pausedAt.current;
    let raf = 0;
    const tick = (now: number) => {
      // Book the next frame first, so one bad frame cannot stop the loop.
      raf = requestAnimationFrame(tick);
      pausedAt.current = now - start;
      paint(pausedAt.current);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [character, action, playing]);

  return (
    <div
      className="relative mx-auto"
      style={{ width: CANVAS_WIDTH, maxWidth: "100%" }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        role="img"
        aria-label="ตัวอย่างการสวมใส่ไอเทมบนตัวละคร"
        className="h-auto w-full rounded-box bg-base-200"
      />
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? "หยุดเล่นภาพเคลื่อนไหว" : "เล่นภาพเคลื่อนไหว"}
        className="btn btn-circle btn-sm absolute right-2 bottom-2 min-h-11 min-w-11"
      >
        {playing ? (
          <Pause aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Play aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
      {current.status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2
            aria-label="กำลังโหลด"
            className="h-6 w-6 animate-spin text-base-content/60"
          />
        </div>
      )}
      {current.status === "error" && (
        <p
          role="alert"
          className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-error"
        >
          โหลดภาพตัวอย่างไม่สำเร็จ
        </p>
      )}
    </div>
  );
}

/** True when this costume item has headgear sprite files to preview. */
export function useCostumeSprite(patchKey: string, costume: boolean) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!costume) return;
    let cancelled = false;
    hasCostumeSprite(patchKey).then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [patchKey, costume]);

  return costume && available;
}

export function CostumePreviewButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="btn btn-outline min-h-11 flex-1 gap-2 sm:flex-none"
    >
      <Eye aria-hidden="true" className="h-4 w-4" />
      Preview
    </button>
  );
}

/** On-screen only: it never takes part in the exported Item card picture. */
export function CostumePreviewModal({
  patchKey,
  name,
  onClose,
}: {
  patchKey: string;
  name: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [gender, setGender] = useState<PreviewGender>("male");
  const [direction, setDirection] = useState(0);
  const [poseType, setPoseType] = useState(POSES[0].type);
  const [playing, setPlaying] = useState(true);
  const titleId = `costume-preview-title-${patchKey}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const turn = (step: number) =>
    setDirection((d) => (d + step + DIRECTIONS.length) % DIRECTIONS.length);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        // A focused dropdown uses the arrow keys itself.
        if (e.target instanceof HTMLSelectElement) return;
        if (e.key === "ArrowLeft") turn(1);
        if (e.key === "ArrowRight") turn(-1);
      }}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box w-full max-w-md space-y-4 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="min-w-0 text-lg font-bold">
            {name}
          </h2>
          <form method="dialog">
            <button
              aria-label="ปิด"
              className="btn btn-circle btn-ghost btn-sm min-h-11 min-w-11"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </form>
        </div>

        <PreviewCanvas
          patchKey={patchKey}
          gender={gender}
          action={poseType * 8 + direction}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-base-content/70">
              ทิศทาง
            </span>
            <div className="flex items-center justify-between gap-2 rounded-box border border-base-300 p-1">
              <button
                type="button"
                onClick={() => turn(1)}
                aria-label="หันไปทางซ้าย"
                className="btn btn-ghost btn-square min-h-11 min-w-11"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <span role="status" className="text-sm font-medium">
                {DIRECTIONS[direction]}
              </span>
              <button
                type="button"
                onClick={() => turn(-1)}
                aria-label="หันไปทางขวา"
                className="btn btn-ghost btn-square min-h-11 min-w-11"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-base-content/70">
              ท่าทาง
            </span>
            <select
              value={poseType}
              onChange={(e) => setPoseType(Number(e.target.value))}
              className="select select-bordered min-h-13 w-full"
            >
              {POSES.map((p) => (
                <option key={p.type} value={p.type}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <div
            role="group"
            aria-label="เพศของตัวละคร"
            className="space-y-1.5 sm:col-span-2"
          >
            <span className="text-xs font-semibold text-base-content/70">
              ตัวละคร
            </span>
            <div className="join w-full">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  aria-pressed={gender === g.value}
                  onClick={() => setGender(g.value)}
                  className={`btn join-item min-h-11 flex-1 ${
                    gender === g.value ? "btn-primary" : ""
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label="ปิด">ปิด</button>
      </form>
    </dialog>
  );
}
