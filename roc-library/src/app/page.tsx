import ImageSlider from "@/components/ImageSlide/ImageSlide";
import ServerInfo from "@/components/ServerInfo/ServerInfo";

export default function Home() {
  return (
    <main className="grid items-center bg-bg text-accent font-8bit pt-[70px] pb-[50px] m-5">
      <ImageSlider></ImageSlider>
      <ServerInfo></ServerInfo>
    </main>
  );
}
