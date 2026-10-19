import Image from "next/image";
import type { Prize } from "@/types/scroll";
import { totalRate } from "@/utils/scrollRoll";
import { TIER_ORDER, TIER_STYLE } from "./tierStyles";

export default function RateTable({ prizes }: { prizes: Prize[] }) {
  const total = totalRate(prizes);
  const sorted = TIER_ORDER.flatMap((tier) => prizes.filter((p) => p.tier === tier));

  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>ไอเทม</th>
            <th className="text-center">จำนวน</th>
            <th className="text-center">ระดับ</th>
            <th className="text-right">โอกาสได้รับ</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="flex items-center gap-2">
                  <Image src={p.image} alt="" width={28} height={28} unoptimized className="shrink-0" />
                  <span>{p.name}</span>
                </div>
              </td>
              <td className="text-center">{p.quantity}</td>
              <td className="text-center">
                <span className={`badge badge-sm ${TIER_STYLE[p.tier].badge}`}>{p.tier}</span>
              </td>
              <td className="text-right tabular-nums">{p.rate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3} className="text-right">
              รวม
            </th>
            <th className={`text-right tabular-nums ${total === 100 ? "" : "text-error"}`}>
              {total.toFixed(2)}%
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
