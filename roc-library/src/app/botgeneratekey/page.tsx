import type { Metadata } from "next";
import BotKeyGenerator from "./BotKeyGenerator";

// Not in any menu, and kept out of search engines. The password is what really protects it.
export const metadata: Metadata = {
  title: "ตัวออกคีย์ Bot",
  robots: { index: false, follow: false, nocache: true },
};

export default function BotGenerateKeyPage() {
  return <BotKeyGenerator />;
}
