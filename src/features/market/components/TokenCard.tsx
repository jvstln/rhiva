import {
  Box,
  Clock,
  Copy,
  Droplet,
  Eye,
  Flag,
  Globe,
  Layers,
  Pencil,
  Search,
  Skull,
  Trophy,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { MarketToken } from "@/data/market-data";
import { InlineStat, MetricChip } from "./MetricChip";
import { TokenThumbnail } from "./TokenThumbnail";

interface TokenCardProps {
  token: MarketToken;
}

export function TokenCard({ token }: TokenCardProps) {
  return (
    <article className="border-border/70 border-b px-4 py-4 last:border-none">
      <div className="flex gap-3">
        <TokenThumbnail />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <h3 className="truncate font-bold text-b-1 text-white">
                {token.name}
              </h3>
              <span className="truncate text-b-4 text-gray">
                {token.subtitle}
              </span>
              <Pencil className="size-3 shrink-0 text-gray" />
              <Copy className="size-3 shrink-0 text-gray" />
            </div>
            <div className="shrink-0 text-right text-b-4">
              <span className="text-gray">V {token.volume}</span>{" "}
              <span className="font-semibold text-warning">
                MC {token.marketCap}
              </span>
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-gray">
            <span className="font-medium text-b-5 text-down">{token.age}</span>
            <InlineStat icon={User} value={0} />
            <InlineStat icon={Globe} value="" />
            <InlineStat icon={Flag} value="" />
            <InlineStat icon={Search} value="" />
            <InlineStat icon={Trophy} value={0} />
            <InlineStat icon={Skull} value={0} />
            <InlineStat icon={Clock} value="16/17" />
            <InlineStat icon={Users} value={35} />
            <InlineStat icon={Box} value="0/0%" />
            <InlineStat icon={Eye} value={3} />
            <span className="ml-auto whitespace-nowrap text-b-5">
              <span className="text-up">N {token.netFlow}</span> TX{" "}
              {token.txCount} —
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-b-4">
            <Link href="#" className="truncate text-primary hover:underline">
              {token.handle}
            </Link>
            <Users className="size-3 text-gray" />
            <span className="text-gray">{token.followers}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        <MetricChip
          icon={User}
          value={token.metrics.holdersPct}
          tone="down"
          filled
        />
        <MetricChip
          icon={Trophy}
          value={`${token.metrics.smartPct} 7d`}
          tone="up"
          filled
        />
        <MetricChip icon={Droplet} value={token.metrics.dropletPct} filled />
        <MetricChip icon={Layers} value={token.metrics.stackPct} filled />
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          <MetricChip icon={Box} value={token.risk.bankPct} filled />
          <MetricChip icon={Droplet} value={token.risk.bundlePct} filled />
          <MetricChip
            icon={Skull}
            value={token.risk.skullPct}
            tone="down"
            filled
          />
          <MetricChip
            icon={Eye}
            value={token.risk.snipePct}
            tone="down"
            filled
          />
        </div>
        <Button variant="sell" size="sm">
          Sell
        </Button>
        <Button variant="default" size="sm">
          Buy
        </Button>
      </div>

      <div className="mt-2 text-b-5 text-gray">{token.wallet}</div>
    </article>
  );
}
