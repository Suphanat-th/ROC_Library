export default function ExpServerPage() {
  const expBasic = 100;
  const expEvent = 150;

  const dropBasic = 100;
  const dropEvent = 50;

  const deathBasic = 100;
  const deathEvent = -100;

  return (
    <ul className="w-full flex flex-col gap-2 col-span-1">
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-purple-800 transition-all active:scale-95">
          <div className="rounded-lg border-2 border-purple-300 bg-purple-100 p-1">
            EXP
          </div>
          <div className="font-semibold"> {expBasic + expEvent}%</div>
        </button>
      </li>
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-blue-800 transition-all active:scale-95">
          <div className="rounded-lg border-2 border-blue-300 bg-blue-100 p-1">
            DROP
          </div>
          <div className="font-semibold">{dropBasic + dropEvent}%</div>
        </button>
      </li>
      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
        <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-red-800 transition-all active:scale-95">
          <div className="rounded-lg border-2 border-red-300 bg-red-100 p-1">
            DEATH
          </div>
          <div className="font-semibold">{deathBasic + deathEvent}%</div>
        </button>
      </li>
    </ul>
  );
}
