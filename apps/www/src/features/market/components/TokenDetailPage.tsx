import { BackButton } from "@/components/layout/BackButton";
import { TokenDetailHeader } from "@/components/token-detail/TokenDetailHeader";
import { TokenDetailRail } from "@/components/token-detail/TokenDetailRail";
import { TradesTable } from "@/components/token-detail/TradesTable";
import type { Token } from "../market.token.type";
import { TokenChart } from "@/features/tradeview/components/TokenChart";

type TokenDetailPageProps = { token: Token };

export const TokenDetailPage = ({ token }: TokenDetailPageProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex flex-1">
        <div className="grow">
          <BackButton />
          <TokenDetailHeader token={token} />
          <TokenChart token={token} />
        </div>

        <TokenDetailRail token={token} />
      </main>

      <TradesTable token={token} />
    </div>
  );
};
