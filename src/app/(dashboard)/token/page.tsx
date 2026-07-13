import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { TokenDetailHeader } from "@/components/token-detail/TokenDetailHeader";
import { TokenDetailRail } from "@/components/token-detail/TokenDetailRail";
import { TradesTable } from "@/components/token-detail/TradesTable";
import { TradingChartPanel } from "@/components/token-detail/TradingChartPanel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TokenDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex flex-1">
        <div>
          <Link
            href="/portfolio"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "ml-2 self-start",
            )}
          >
            <ChevronLeft /> Back
          </Link>
          <TokenDetailHeader />
          <TradingChartPanel />
        </div>
        <TokenDetailRail />
      </main>

      <TradesTable />
    </div>
  );
}
