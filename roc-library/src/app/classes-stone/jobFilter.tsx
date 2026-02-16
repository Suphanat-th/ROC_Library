"use client";

type Option = {
  value: string;
  label: string;
  image: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function JobSelect({ options, value, onChange }: Props) {
  const selected =
    options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="dropdown dropdown-bottom w-64">
      {/* ปุ่มหลัก */}
      <label
        tabIndex={0}
        className="btn btn-outline w-full justify-start gap-3"
      >
        <img
          src={selected.image}
          alt={selected.label}
          className="w-6 h-6"
        />
        <span className="flex-1 text-left">{selected.label}</span>
      </label>

      {/* Dropdown list */}
      <ul
        tabIndex={0}
        className="dropdown-content menu mt-2 w-full rounded-box bg-base-100 shadow text-black"
      >
        {options.map((opt) => (
          <li key={opt.value}>
            <button
              className="flex items-center gap-3"
              onClick={() => onChange(opt.value)}
            >
              <img
                src={opt.image}
                alt={opt.label}
                className="w-6 h-6"
              />
              <span>{opt.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
