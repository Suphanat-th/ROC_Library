export default function ImageConvertPageMuad({ patchKey }: { patchKey: string }) {
  return (
    <div className="image-item flex items-center justify-center p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="rounded-xl"
        src={`/assets/images/muad/${patchKey}`}
        alt="ภาพไอเทม"
        width={150}
        height={300}
        onError={(e) => {
          e.currentTarget.src = "/assets/images/GuildImage/dog.jpg";
        }}
      />
    </div>
  );
}
