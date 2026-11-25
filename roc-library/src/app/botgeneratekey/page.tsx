import type { Metadata } from "next";
import BotKeyPage from "./BotKeyPage";

// Not in any menu, and kept out of search engines. The sign-in modal is what really protects it.
export const metadata: Metadata = {
  title: "ตัวออกคีย์ Bot",
  robots: { index: false, follow: false, nocache: true },
};

export default function BotGenerateKeyPage() {
  return <BotKeyPage />;
}
