import { Copy, ExternalLink, Lock, Search } from "lucide-react";

import type { Token } from "@/features/market/market.token.type";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/finance.util";
import { InfoRow, InfoSection } from "./InfoSection";

type TokenDetailCardProps = { token: Token };

function formatDate(value?: number | null) {
  if (!value) return "N/A";
  const millis = value < 1e12 ? value * 1000 : value;
  return new Date(millis).toLocaleString();
}

function shortenAddress(value?: string | null) {
  if (!value) return "N/A";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function DynamicPoolInfoCard({ token }: TokenDetailCardProps) {
  const liquidity = token.liquidityUsd;

  return (
    <InfoSection title="Dynamic BC Pool Info">
      <InfoRow
        label="Total liq"
        value={
          <span className="flex items-center gap-1 font-medium">
            {liquidity !== undefined ? formatCompactCurrency(liquidity) : "N/A"}
            <Lock className="size-3 text-gray" />
          </span>
        }
      />
      <div className="mt-2 grid grid-cols-3 gap-2 text-b-5 text-gray">
        <span>Pair</span>
        <span>Liq/Initial</span>
        <span className="text-right">Value</span>
      </div>
      <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
        <span className="text-white">
          {token.symbol ?? token.name ?? "Token"}
        </span>
        <span className="text-white">
          {token.liquidityUsd ? "Live" : "N/A"}
        </span>
        <span className="text-right text-white">
          {liquidity !== undefined ? formatCompactCurrency(liquidity) : "N/A"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
        <span className="text-white">SOL</span>
        <span className="text-up">N/A</span>
        <span className="text-right text-white">
          {token.liquidityUsd !== undefined
            ? formatCompactCurrency(token.liquidityUsd)
            : "N/A"}
        </span>
      </div>
    </InfoSection>
  );
}

export function DevInfoCard({ token }: TokenDetailCardProps) {
  return (
    <InfoSection title="DEV Info">
      <InfoRow
        label="DEV"
        value={
          <span className="flex items-center gap-1 font-medium">
            {shortenAddress(token.dev.address ?? token.mint)}
            <Copy className="size-3 text-gray" />
            <Search className="size-3 text-gray" />
          </span>
        }
      />
      <InfoRow
        label="Funding"
        value={
          <span className="flex items-center gap-1 font-medium">
            <ExternalLink className="size-3 text-gray" />{" "}
            {formatCompactNumber(token.dev.tokenBalance)} SOL
          </span>
        }
      />
    </InfoSection>
  );
}

export function BasicDataCard({ token }: TokenDetailCardProps) {
  return (
    <InfoSection title="Basic Data">
      <InfoRow
        label="Market cap"
        value={
          token.marketCapUsd !== undefined
            ? formatCompactCurrency(token.marketCapUsd)
            : "N/A"
        }
      />
      <InfoRow
        label="Holders"
        value={
          token.holders.total !== undefined
            ? formatCompactNumber(token.holders.total)
            : "N/A"
        }
      />
      <InfoRow
        label="Total supply"
        value={
          token.totalSupply !== undefined
            ? formatCompactNumber(token.totalSupply)
            : "N/A"
        }
      />
      <InfoRow
        label="Pair"
        value={
          <span className="flex items-center gap-1">
            {shortenAddress(token.mint)} <Copy className="size-3 text-gray" />
          </span>
        }
      />
      <InfoRow
        label="Token created"
        value={formatDate(Number(token.updatedAt))}
      />
      <InfoRow
        label="Pool created"
        value={formatDate(Number(token.updatedAt))}
      />
    </InfoSection>
  );
}
