export default function ImageConvertPage({ patchKey }: { patchKey: string }) {
  return (
    <div className="flex justify-center items-center  backdrop-blur-sm p-4 rounded-2xl image-item mb-3">
      <img
        className="rounded-xl  hover:scale-105 transition-transform duration-300"
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
