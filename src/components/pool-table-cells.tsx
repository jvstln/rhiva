import { cn } from "@/lib/utils";

export function PoolPairIcon() {
  return (
    <div className="relative flex size-9 shrink-0 items-center">
      <span className="z-10 flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-b-6 font-bold text-white ring-2 ring-card">
        S
      </span>
      <span className="-ml-2.5 flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-b-6 font-bold text-white ring-2 ring-card">
        U
      </span>
    </div>
  );
}

export function ValueChangeCell({
  value,
  change,
}: {
  value: string;
  change: string;
}) {
  const isDown = change.trim().startsWith("-");
  return (
    <div>
      <p className="text-b-3 font-medium text-white">{value}</p>
      <p className={cn("text-b-5", isDown ? "text-down" : "text-up")}>
        {change}
      </p>
    </div>
  );
}
