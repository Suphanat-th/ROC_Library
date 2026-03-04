import { CategoryFilterProps } from "@/types/jobs";

export const CategoryFilter = ({
  selected,
  onSelect,
  categories,
}: CategoryFilterProps) => (
  <div className="flex w-full bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all min-w-[80px] ${
          selected === cat
            ? "bg-blue-500 text-white shadow-lg"
            : "bg-transparent text-slate-500 hover:text-slate-200"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);
