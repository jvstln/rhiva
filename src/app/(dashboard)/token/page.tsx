"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TokenDetailHeader } from "@/components/token-detail/TokenDetailHeader";
import { TokenDetailRail } from "@/components/token-detail/TokenDetailRail";
import { TradesTable } from "@/components/token-detail/TradesTable";
import { TradingChartPanel } from "@/components/token-detail/TradingChartPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TokenDetailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex flex-1">
        <div className="grow">
          <Button
            onClick={() => router.back()}
            variant={"ghost"}
            className={cn("ml-2 self-start")}
          >
            <ChevronLeft /> Back
          </Button>
          <TokenDetailHeader />
          <TradingChartPanel />
        </div>

        <TokenDetailRail />
      </main>

      <TradesTable />
    </div>
  );
}
