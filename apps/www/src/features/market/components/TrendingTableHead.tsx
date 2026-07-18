import { TABLE_COLUMNS } from "@/data/market-trending-data";

export function TrendingTableHead() {
  return (
    <div className="grid grid-cols-[280px_150px_150px_150px_140px_1fr_140px] items-center border-white/10 border-b px-6 py-4 text-b-3 text-white">
      {TABLE_COLUMNS.map((col) => (
        <span
          key={col}
          className={col === "Action" ? "text-left" : ""}
        >
          {col}
        </span>
      ))}
    </div>
  );
}
