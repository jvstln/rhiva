"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PortfolioErrorBannerProps = {
  query: Pick<UseQueryResult, "isError" | "isRefetching" | "refetch">;
  message?: string;
  className?: string;
};

export const PortfolioErrorBanner = ({
  query,
  message,
  className,
}: PortfolioErrorBannerProps) => {
  if (!query.isError) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-medium text-b-3 text-destructive">
        <AlertTriangle className="size-4 shrink-0" />
        {message ?? "Failed to load your portfolio data."}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => query.refetch()}
        loading={query.isRefetching}
      >
        <RefreshCw className="size-3.5" />
        Retry
      </Button>
    </div>
  );
};
