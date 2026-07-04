import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { TokenDetailHeader } from "@/components/token-detail/TokenDetailHeader";
import { TokenDetailRail } from "@/components/token-detail/TokenDetailRail";
import { TradesTable } from "@/components/token-detail/TradesTable";
import { TradingChartPanel } from "@/components/token-detail/TradingChartPanel";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TokenDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Link
        href="/portfolio"
        className={cn(buttonVariants({ variant: "ghost" }), "self-start ml-2")}
      >
        <ChevronLeft /> Back
      </Link>
      <TokenDetailHeader />

      <main className="flex flex-1">
        <TradingChartPanel />
        <TokenDetailRail />
      </main>

      <TradesTable />
      <AssistantBubble />
    </div>
  );
}
