export default function ImageConvertPage({ patchKey }: { patchKey: string }) {
  return (
    <div className="flex justify-center items-center bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-inner image-item mb-3">
      <img
        className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        src={`/assets/images/PatchImage/${patchKey}.bmp`}
        alt="item image"
        width={150}
        height={300}
        onError={(e) => {
          e.currentTarget.src = "/assets/images/GuildImage/dog.jpg";
        }}
      />
    </div>
  );
}
