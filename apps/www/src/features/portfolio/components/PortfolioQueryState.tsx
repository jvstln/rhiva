"use client";

import type React from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import { QueryState } from "@/components/layout/QueryState";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

type PortfolioQueryStateProps<TData> = {
  query: UseQueryResult<TData>;
  pausedEmpty?: string;
  getIsEmpty?: (data: NonNullable<TData>) => boolean | string;
  children: (
    query: UseQueryResult<TData> & { data: NonNullable<TData> },
  ) => React.ReactNode;
};

/**
 * Wraps QueryState for portfolio data surfaces.
 * - QueryState renders loading/empty/data, but its error panel would replace
 *   the data area; errors are surfaced separately via `PortfolioErrorBanner`,
 *   so QueryState's error panel is suppressed here.
 * - A paused query (wallet not connected) renders an empty state instead of
 *   an endless spinner.
 */
export function PortfolioQueryState<TData>({
  query,
  pausedEmpty,
  getIsEmpty,
  children,
}: PortfolioQueryStateProps<TData>) {
  if (!query.data && query.fetchStatus === "paused") {
    return (
      <div className="flex min-h-40 w-full items-center justify-center rounded-2xl border border-border/70 bg-card p-6">
        <Empty className="border-none bg-transparent">
          <EmptyHeader>
            <EmptyTitle>{pausedEmpty ?? "No data available"}</EmptyTitle>
            <EmptyDescription>
              Connect your wallet to view your positions.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <QueryState
      query={query}
      getIsError={() => undefined}
      getIsEmpty={(q) => (getIsEmpty ? getIsEmpty(q.data) : false)}
    >
      {children}
    </QueryState>
  );
}
