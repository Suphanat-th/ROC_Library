interface EquipSlotProps {
  label: string;
  item: string;
  icon: string;
}

const EquipSlot = ({ label, item, icon }: EquipSlotProps) => (
  <div className="card bg-white/40 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-ro-blue/50 p-3 flex flex-row items-center gap-3">
    <div className="text-2xl bg-white rounded-xl p-2 shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className="text-xs font-bold truncate w-24">{item}</p>
    </div>
  </div>
)
export default EquipSlot;