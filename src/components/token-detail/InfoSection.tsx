import { ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function InfoSection({ title, aside, children }: InfoSectionProps) {
  return (
    <div className="border-t border-border/70 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-b-2 font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2 text-b-4 text-grey">
          {aside}
          <ChevronUp className="size-4" />
        </div>
      </div>
      {children}
    </div>
  );
}

export function InfoRow({
  label,
  value,
  valueClassName = "text-white",
}: {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5 text-b-4">
      <span className="text-grey">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
