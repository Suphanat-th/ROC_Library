import HomeSlider from "@/components/HomeSlider/HomeSlider";
import ServerInfo from "@/components/ServerInfo/ServerInfo";
import { buildHomeSlides } from "@/data/homeSlides";

export default async function Home() {
  const slides = await buildHomeSlides();

  return (
    <main className="w-full min-h-screen bg-base-200 px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <HomeSlider slides={slides} />
        <ServerInfo></ServerInfo>
      </div>
    </main>
  );
}
