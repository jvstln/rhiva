"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TokenDetailStatsGrid } from "@/features/market/components/TokenDetailStatsGrid";

const TOKEN_KEYS = ["base", "quote"] as const;
type TokenKey = (typeof TOKEN_KEYS)[number];

export function PoolDetailTokenInfo({ pool }: { pool: LiquidityPool }) {
  const [tokenKey, setTokenKey] = useState<TokenKey>("base");

  const token = tokenKey === "base" ? pool.token_a : pool.token_b;
  const symbol =
    token?.symbol ?? (tokenKey === "base" ? pool.base_symbol : "SOL");
  const mint = token?.mint;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium text-b-3 text-white">Token Info</h3>
        <ToggleGroup size="sm">
          {TOKEN_KEYS.map((key) => (
            <ToggleGroupItem
              key={key}
              pressed={tokenKey === key}
              onPressedChange={(pressed) => {
                if (pressed) setTokenKey(key);
              }}
            >
              {key === "base"
                ? pool.token_a?.symbol || pool.base_symbol || "Base"
                : pool.token_b?.symbol || "SOL"}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {token ? (
        <>
          <TokenDetailStatsGrid token={token} />
          {mint && (
            <Link
              href={`/token/${mint}`}
              className="flex items-center gap-1 text-b-5 text-gray transition-colors hover:text-white"
            >
              Open {symbol}
              <ExternalLink className="size-3.5" />
            </Link>
          )}
        </>
      ) : (
        <p className="text-b-5 text-gray">No token data</p>
      )}
    </div>
  );
}
