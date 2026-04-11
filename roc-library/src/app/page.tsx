import ImageSlider from "@/components/ImageSlide/ImageSlide";
import ServerInfo from "@/components/ServerInfo/ServerInfo";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gray-50 font-8bit px-4 py-6 md:px-6 md:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <ImageSlider></ImageSlider>
        <ServerInfo></ServerInfo>
      </div>
    </main>
  );
}
