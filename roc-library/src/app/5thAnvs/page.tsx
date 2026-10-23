import ChapterMap from "./components/ChapterMap";
import RecurringQuests from "./components/RecurringQuests";
import RewardsTeaser from "./components/RewardsTeaser";
import SectionHeading from "./components/SectionHeading";
import TitleBanner from "./components/TitleBanner";

/*
 * Held back for now, not deleted: Hero, InfoSections and Reveal. The Rewards live on
 * their own page, /5thAnvs/rewards (AnniversaryRewards and the components it uses).
 */
export default function FifthAnniversaryPage() {
  return (
    <main className="anvs mx-auto max-w-5xl space-y-16 px-4 py-6 sm:px-6">
      <TitleBanner />
      <section aria-labelledby="map-title" className="space-y-5">
        <SectionHeading index="01" title="แผนที่ Chapter" id="map-title" />
        <ChapterMap />
      </section>
      <RecurringQuests index="02" />
      <RewardsTeaser index="03" />
    </main>
  );
}
