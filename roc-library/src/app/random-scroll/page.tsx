import ScrollRoller from "@/components/ScrollRoller";
import { FESTA_2026_PRIZES } from "@/data/scroll/festa2026";

export default function RandomScrollPage() {
  return <ScrollRoller title="Ragnarok Festa 2026 Scroll" prizes={FESTA_2026_PRIZES} />;
}
