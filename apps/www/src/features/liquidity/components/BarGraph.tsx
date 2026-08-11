import { cn } from "@/lib";
import { useMemo, useState } from "react";

export interface BarGraphProps {
  data: Array<{
    label?: number;
    /** Relative magnitude for this bar. Any positive number — auto-scaled unless normalize=false. */
    value: number;
  }>;
  /** Index of the bar treated as "current price". Defaults to the middle bar. */
  markerIndex?: number;
  title?: string;
  leftColor?: string;
  rightColor?: string;
  markerColor?: string;
  formatLabel?: (label: BarGraphProps["data"][number]["label"]) => string;
  /** Scale bar heights against the max value in `data`. */
  normalize?: boolean;
  showLabels?: boolean;
  classNames?: Partial<Record<"container" | "bars" | "labels", string>>;
}

export function BarGraph({
  data,
  markerIndex,
  title,
  leftColor = "#a855f7",
  rightColor = "var(--color-primary)",
  markerColor = "#ffffff",
  formatLabel,
  normalize = true,

  showLabels = false,
  classNames,
}: BarGraphProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const marker = markerIndex ?? Math.floor(data.length / 2);
  const maxValue = useMemo(
    () => (normalize ? Math.max(...data.map((d) => d.value), 1e-9) : 1),
    [data, normalize],
  );

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "select-none bg-transparent font-mono text-[#666] text-[10px]",
          classNames?.container,
        )}
      >
        No data
      </div>
    );
  }

  return (
    <div
      className={cn(
        "select-none bg-transparent font-mono text-[#e5e5e5]",
        classNames?.container,
      )}
    >
      {title && (
        <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4 }}>
          {title}
        </div>
      )}

      <div className={cn("flex h-16 items-end gap-px", classNames?.bars)}>
        {data.map((bar, i) => (
          <Bar
            // biome-ignore lint/suspicious/noArrayIndexKey: false positive
            key={i}
            bar={bar}
            isMarker={i === marker}
            isLeftOfMarker={i < marker}
            heightPct={Math.max(0.08, bar.value / maxValue)}
            color={
              i === marker ? markerColor : i < marker ? leftColor : rightColor
            }
            dimmed={hoverIndex !== null && hoverIndex !== i}
            onHover={() => setHoverIndex(i)}
            onLeave={() => setHoverIndex(null)}
          />
        ))}
      </div>

      {showLabels && (
        <div className={cn("mt-0.75 flex", classNames?.labels)}>
          {data.map((bar, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: false positive
              key={i}
              className="flex-1 overflow-hidden whitespace-nowrap text-center text-[#666] text-[7px] data-marker:text-foreground"
            >
              {formatLabel?.(bar.label)}
            </div>
          ))}
        </div>
      )}

      {hoverIndex !== null && (
        <div style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
          {formatLabel?.(data[hoverIndex].label)} ·{" "}
          {data[hoverIndex].value.toFixed(2)}
        </div>
      )}
    </div>
  );
}

interface BarProps {
  bar: BarGraphProps["data"][number];
  isMarker: boolean;
  isLeftOfMarker: boolean;
  heightPct: number;
  color: string;
  dimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function Bar({
  bar,
  isMarker,
  heightPct,
  color,
  dimmed,
  onHover,
  onLeave,
}: BarProps) {
  return (
    <section
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      title={`${bar.label}${isMarker ? " (current)" : ""}`}
      style={{
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          width: "100%",
          height: `${heightPct * 100}%`,
          borderRadius: 1,
          background: color,
          opacity: dimmed ? 0.4 : 1,
          boxShadow: isMarker ? `0 0 4px ${color}` : "none",
          transition: "opacity 100ms ease",
        }}
      />
    </section>
  );
}
