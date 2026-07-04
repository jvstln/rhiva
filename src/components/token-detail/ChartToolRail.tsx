import {
  Crosshair,
  Eraser,
  LineChart as LineChartIcon,
  List,
  Magnet,
  Pencil,
  Ruler,
  Smile,
  Type,
  Waypoints,
  ZoomIn,
} from "lucide-react";

const TOOLS = [
  Crosshair,
  LineChartIcon,
  List,
  Waypoints,
  Magnet,
  Pencil,
  Smile,
  Type,
  Ruler,
  ZoomIn,
  Eraser,
];

export function ChartToolRail() {
  return (
    <div className="hidden w-9 shrink-0 flex-col items-center gap-4 border-r border-border/70 py-3 md:flex">
      {TOOLS.map((Icon, i) => (
        <button
          type="button"
          key={i}
          className="flex size-6 items-center justify-center text-gray transition-colors hover:text-white"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
