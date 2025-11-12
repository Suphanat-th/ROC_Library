interface SwitchOnPageProps {
  bit: string;
}

export default function SwitchOnPage({ bit }: SwitchOnPageProps) {
  const isOn = bit === "1";
  return (
    <div className="relative rounded-xl flex justify-center items-center overflow-hidden">
      {isOn && (
        <div className="absolute w-40 h-40 rounded-full bg-yellow-400 opacity-90 blur-3xl animate-pulse"></div>
      )}
    </div>
  );
}
