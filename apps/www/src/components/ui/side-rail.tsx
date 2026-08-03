import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function SideRailSection({
  title,
  children,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Collapsible
      className="px-4 py-3"
      defaultOpen={true}
    >
      {title && (
        <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between">
          <h3 className="mr-auto font-semibold text-b-2 text-white">{title}</h3>
          <ChevronDown className="size-4 transition-transform [[data-panel-open]_*]:rotate-180" />
        </CollapsibleTrigger>
      )}

      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function SideRailRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-0.5 text-b-4">
      <span className="text-gray">{label}</span>
      <span>{value}</span>
    </div>
  );
}
