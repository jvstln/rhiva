import { BackButton } from "@/components/layout/BackButton";
import { TokenDetailRail } from "@/components/token-detail/TokenDetailRail";
import { TradesTable } from "@/components/token-detail/TradesTable";
import type { Token } from "../market.token.type";
import { TokenChart } from "@/features/tradeview/components/TokenChart";
import { TokenDetailHeader } from "./TokenDetailHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TokenDetailPageProps = { token: Token };

export const TokenDetailPage = ({ token }: TokenDetailPageProps) => {
  return (
    <div className="flex">
      <ScrollArea className="h-full min-h-0 w-full min-w-0">
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <BackButton />
          <TokenDetailHeader token={token} />
          <TokenChart token={token} />
          <TradesTable token={token} />
        </div>
        <ScrollBar
          orientation="vertical"
          showIndicator
          showScrollBar={false}
        />
      </ScrollArea>

      <TokenDetailRail token={token} />
    </div>
  );
};
