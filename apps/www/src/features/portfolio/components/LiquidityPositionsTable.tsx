import Link from "next/link";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { CircleDollarSign, RefreshCcwIcon, Share, X } from "lucide-react";

import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SolanaIcon } from "@/components/ui/icons";
import { PnlExportDialog } from "./PnlExportDialog";
import { LP_POSITIONS } from "@/components/ui/data/portfolio-data";
import { usePortfolioStore } from "@/features/portfolio/portfolio.store";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { POOL_DEXES } from "@/features/liquidity/liquidity.schema";

const columnHelper = createColumnHelper<(typeof LP_POSITIONS)[0]>();

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
        <PnlExportDialog>
          <Button tooltip="Share" variant="ghost" size="icon-sm">
            <Share className="text-gray" />
          </Button>
        </PnlExportDialog>
      )}
    </div>
  );
};

const columns = [
  columnHelper.accessor((row) => row, {
    header: "POSITION/POOL",
    cell: ({ row }) => (
      <div
        className="group flex items-center gap-3 transition-opacity hover:opacity-80"
        data-pool-id={row.original.pool}
      >
        <Link
          href="/token/123"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Avatar>
            <AvatarImage />
            <AvatarFallback>
              <SolanaIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link
            href="/token/123"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="font-bold text-b-2"
          >
            {row.original.pool}
          </Link>
          <div className="flex items-center gap-1.5">
            <p className="text-b-5 text-gray">{row.original.timeAgo}</p>
            {(() => {
              const Icon = POOL_DEXES["meteora-dlmm"].icon;
              return <Icon className="size-3" />;
            })()}
          </div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor((row) => row, {
    header: "PnL",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-up">{row.original.pnlUsd}</p>
        <p className="font-medium text-up">{row.original.pnlPct}</p>
      </div>
    ),
  }),
  columnHelper.accessor("totalDeposit", {
    header: "Your Liquidity",
    cell: ({ row }) => (
      <p className="font-medium text-white">{row.original.totalDeposit}</p>
    ),
  }),
  columnHelper.accessor("totalWithdraw", {
    header: "Claimable Fees",
    cell: ({ row }) => (
      <p className="font-medium text-white">{row.original.totalWithdraw}</p>
    ),
  }),
  columnHelper.display({
    id: "feeTvl",
    header: "24h Fee / TVL",
    cell: () => <p className="font-medium text-white">0.53%</p>,
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
  const router = useRouter();

  const table = useDataTable({
    data: LP_POSITIONS,
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 px-1">
        <ToggleGroup defaultValue={["all"]}>
          <ToggleGroupItem value="all">All pools</ToggleGroupItem>
          {Object.entries(POOL_DEXES).map(([key, pool]) => (
            <ToggleGroupItem key={key} value={key}>
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
      <nav
        onClick={(e) => {
          if (!(e.target instanceof HTMLElement)) return;

          const tableRow = e.target.closest("tr");
          const poolId =
            tableRow?.querySelector<HTMLElement>("[data-pool-id]")?.dataset
              .poolId;

          if (poolId) router.push(`/liquidity/detail/${poolId}`);
        }}
        onKeyDown={() => null}
      >
        <DataTable table={table} />
      </nav>
    </div>
  );
};
