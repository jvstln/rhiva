import { createColumnHelper } from "@tanstack/react-table";
import { CircleDollarSign, RefreshCcwIcon, Share, X } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LP_POSITIONS } from "@/data/portfolio-data";
import { POOLS } from "@/features/liquidity/liquidity.schema";
import { usePortfolioStore } from "@/features/portfolio/portfolio.store";
import { capitalize, cn } from "@/lib/utils";

const columnHelper = createColumnHelper<(typeof LP_POSITIONS)[0]>();

const LinkWrapper = ({
  ...props
}: Partial<React.ComponentProps<typeof Link>>) => (
  <Link
    {...props}
    href="/liquidity/detail"
    className={cn("block", props.className)}
  />
);

const filters = ["openedPosition", "history"];

const ActionCell = () => {
  const activeFilter = usePortfolioStore((state) => state.liquidityFilter);

  return (
    <div className="flex items-center justify-end gap-1">
      {activeFilter === "openedPosition" ? (
        <>
          <Button
            tooltip="Claim"
            variant="soft"
            size="icon-sm"
            className="[--accent:var(--color-emerald-500)]"
          >
            <CircleDollarSign />
          </Button>
          <Button
            tooltip="Rebalance"
            variant="soft"
            size="icon-sm"
            className="[--accent:var(--color-blue-500)]"
          >
            <RefreshCcwIcon />
          </Button>
          <Button
            tooltip="Close position"
            variant="soft"
            size="icon-sm"
            className="[--accent:var(--color-red-500)]"
          >
            <X />
          </Button>
        </>
      ) : (
        <Button tooltip="Share" variant="ghost" size="icon-sm">
          <Share className="text-gray" />
        </Button>
      )}
    </div>
  );
};

const columns = [
  columnHelper.accessor((row) => row, {
    header: "POSITION/POOL",
    cell: ({ row }) => (
      <LinkWrapper className="group flex items-center gap-3 transition-opacity hover:opacity-80">
        <Avatar>
          <AvatarImage />
          <AvatarFallback>
            <SolanaIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-b-2">{row.original.pool}</p>
          <div className="flex items-center gap-1.5">
            <p className="text-b-5 text-gray">{row.original.timeAgo}</p>
            {(() => {
              const Icon = POOLS[row.index % POOLS.length].icon;
              return <Icon className="size-3" />;
            })()}
          </div>
        </div>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor((row) => row, {
    header: "PnL",
    cell: ({ row }) => (
      <LinkWrapper className="flex flex-col gap-0.5">
        <p className="font-medium text-up">{row.original.pnlUsd}</p>
        <p className="font-medium text-up">{row.original.pnlPct}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("totalDeposit", {
    header: "Your Liquidity",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="font-medium text-white">{row.original.totalDeposit}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.accessor("totalWithdraw", {
    header: "Claimable Fees",
    cell: ({ row }) => (
      <LinkWrapper>
        <p className="font-medium text-white">{row.original.totalWithdraw}</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.display({
    id: "feeTvl",
    header: "24h Fee / TVL",
    cell: () => (
      <LinkWrapper>
        <p className="font-medium text-white">0.53%</p>
      </LinkWrapper>
    ),
  }),
  columnHelper.display({
    id: "action",
    header: "",
    cell: () => <ActionCell />,
  }),
];

export const LiquidityPositionsTable = () => {
  const activeFilter = usePortfolioStore((state) => state.liquidityFilter);
  const setActiveFilter = usePortfolioStore(
    (state) => state.setLiquidityFilter,
  );

  const table = useDataTable({
    data: LP_POSITIONS,
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 px-1">
        <ToggleGroup defaultValue={["all"]}>
          <ToggleGroupItem value="all">All pools</ToggleGroupItem>
          {POOLS.map((pool) => (
            <ToggleGroupItem key={pool.id} value={pool.id}>
              <pool.icon />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex items-center gap-1">
          {filters.map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant="ghost"
              size="sm"
              data-active={activeFilter === filter ? true : undefined}
            >
              {capitalize(filter)}
            </Button>
          ))}
        </div>
      </div>
      <DataTable table={table} />
    </div>
  );
};
