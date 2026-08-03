import Link from "next/link";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { CircleDollarSign, RefreshCcwIcon, Share, X } from "lucide-react";

import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PnlExportDialog } from "./PnlExportDialog";
import { usePortfolioStore } from "@/features/portfolio/portfolio.store";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { POOL_DEXES } from "@/features/liquidity/liquidity.schema";
import { formatCompactCurrency, formatSignedPercent } from "@/lib/finance.util";
import type { LpPosition, TokenDetail } from "@rhivadotfun/dataapi";
import { useTokens } from "@/features/market/market.hook";
import { useMemo } from "react";
import { useLiquidityPool } from "@/features/liquidity/liquidity.hook";

type LpPositionWithToken = LpPosition & {
  token: { isPending: boolean; data?: TokenDetail };
  pnlUsd: string;
  pnlPct: string;
  totalDeposit: string;
  totalWithdraw: string;
};

const columnHelper = createColumnHelper<LpPositionWithToken>();

const filters = ["openedPosition", "history"];

const positionSymbol = (row: LpPositionWithToken) =>
  row.symbol ?? row.token.data?.symbol;

const FeeTvlCell = ({ poolAddress }: { poolAddress: string }) => {
  const { data: pool, isPending } = useLiquidityPool(poolAddress);
  const ratio = pool?.fees_ratio;

  return (
    <p className="font-medium text-white">
      {isPending ? (
        <Spinner className="size-3.5" />
      ) : ratio == null ? (
        "-"
      ) : (
        `${(ratio * 100).toFixed(2)}%`
      )}
    </p>
  );
};

const ActionCell = ({ position }: { position: LpPositionWithToken }) => {
  const activeFilter = usePortfolioStore((state) => state.liquidityFilter);
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {activeFilter === "openedPosition" ? (
        <>
          <Button
            tooltip="Claim"
            variant="soft"
            size="icon-sm"
            className="[--accent:var(--color-emerald-500)]"
            onClick={handleStopPropagation}
            data-require-auth
          >
            <CircleDollarSign />
          </Button>
          <Button
            tooltip="Rebalance"
            variant="soft"
            size="icon-sm"
            className="[--accent:var(--color-blue-500)]"
            onClick={handleStopPropagation}
            data-require-auth
          >
            <RefreshCcwIcon />
          </Button>
          <Button
            tooltip="Close position"
            variant="soft"
            size="icon-sm"
            className="[--accent:var(--color-red-500)]"
            onClick={handleStopPropagation}
            data-require-auth
          >
            <X />
          </Button>
        </>
      ) : (
        <PnlExportDialog position={position}>
          <Button
            tooltip="Share"
            variant="ghost"
            size="icon-sm"
            onClick={handleStopPropagation}
          >
            <Share className="text-muted-foreground" />
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
        data-pool-id={row.original.pool_address}
      >
        <Link
          href={`/token/${row.original.mint}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Avatar>
            <AvatarImage src={row.original.token.data?.logo_uri ?? ""} />
            <AvatarFallback>{positionSymbol(row.original)}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link
            href={`/token/${row.original.mint}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="font-bold text-b-2"
          >
            {positionSymbol(row.original)}
          </Link>
          <div className="flex items-center gap-1.5">
            <p className="text-b-5 text-muted-foreground">
              {row.original.is_open ? "Open" : "Closed"}
            </p>
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
    cell: ({ row }) => <FeeTvlCell poolAddress={row.original.pool_address} />,
  }),
  columnHelper.display({
    id: "action",
    header: "",
    cell: ({ row }) => <ActionCell position={row.original} />,
  }),
];

export const LiquidityPositionsTable = ({
  positions,
}: {
  positions: LpPosition[];
}) => {
  const filter = usePortfolioStore((state) => state.liquidityFilter);
  const setFilter = usePortfolioStore((state) => state.setLiquidityFilter);

  const tokens = useTokens(positions.map((position) => position.mint));
  const router = useRouter();

  const data = useMemo(() => {
    return positions.map((position) => {
      const pnlUsd = (position.current_value_usd ?? 0) - position.net_amount;

      return {
        ...position,
        token: {
          isPending: tokens.isPending,
          data: tokens.data?.find((token) => token.mint === position.mint),
        },
        totalDeposit: formatCompactCurrency(position.deposited),
        totalWithdraw: formatCompactCurrency(position.withdrawn),
        pnlUsd: formatCompactCurrency(pnlUsd),
        pnlPct: formatSignedPercent(
          position.net_amount > 0 ? (pnlUsd / position.net_amount) * 100 : null,
        ),
      };
    });
  }, [positions, tokens.data, tokens.isPending]);

  const table = useDataTable({
    data,
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 px-1">
        <ToggleGroup defaultValue={["all"]}>
          <ToggleGroupItem value="all">All pools</ToggleGroupItem>
          {Object.entries(POOL_DEXES).map(([key, pool]) => (
            <ToggleGroupItem
              key={key}
              value={key}
            >
              <pool.icon />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <Button
              key={filter}
              onClick={() => setFilter(filter)}
              variant="ghost"
              size="sm"
              data-active={f === filter ? true : undefined}
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
