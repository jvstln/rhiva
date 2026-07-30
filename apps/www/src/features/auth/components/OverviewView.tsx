import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import {
  Send,
  Wallet,
  LogOut,
  PlusCircle,
  RefreshCw,
  ArrowDownLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ParsedTokenAccount } from "@/queries";
import { CopyButton } from "@/components/ui/button/copy-button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OverviewViewProps {
  address: string;
  walletClientType?: string;
  onDisconnect: () => void;
  onFetchBalances: () => void;
  isLoadingBalances: boolean;
  balances?: ParsedTokenAccount[];
  onNavigate: (view: "deposit" | "transfer" | "withdraw") => void;
}

export default function OverviewView({
  address,
  balances,
  walletClientType,
  isLoadingBalances,
  onNavigate,
  onFetchBalances,
  onDisconnect,
}: OverviewViewProps) {
  const { logout } = usePrivy();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Manage Wallet</DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-3">
        <div className="space-y-4 rounded-xl border bg-card p-5 text-card-foreground">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Wallet className="size-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base leading-none">
                {walletClientType === "privy"
                  ? "Embedded Wallet"
                  : walletClientType || "Connected Wallet"}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
                <span className="truncate font-mono">
                  {address.slice(0, 8)}...{address.slice(-8)}
                </span>
                {address && <CopyButton copy={address} />}
              </div>
            </div>
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                Balances
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={onFetchBalances}
                disabled={isLoadingBalances}
                className="size-7 rounded-full hover:bg-muted"
              >
                <RefreshCw
                  className={cn(
                    "size-3.5",
                    isLoadingBalances && "animate-spin",
                  )}
                />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {balances?.map((balance) => (
                <div
                  key={balance.info.mint}
                  className="rounded-lg border bg-muted/30 p-3"
                >
                  <Image
                    src={balance.metadata.image}
                    alt={balance.metadata.symbol}
                    width={32}
                    height={32}
                  />
                  <p className="text-muted-foreground text-xs">
                    {balance.metadata.name}
                  </p>
                  <p className="mt-1 truncate font-bold text-lg">
                    {balance.info.tokenAmount.uiAmount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { action: "deposit" as const, icon: PlusCircle },
            { action: "transfer" as const, icon: Send },
            { action: "withdraw" as const, icon: ArrowDownLeft },
          ].map((props) => (
            <Button
              key={props.action}
              variant="outline"
              className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary/5 hover:text-primary"
              onClick={() => onNavigate(props.action)}
            >
              <props.icon className="size-5" />
              <span className="text-xs capitalize">{props.action}</span>
            </Button>
          ))}
        </div>
        <Button
          variant="destructive"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-6 transition-all duration-200 hover:bg-destructive/90"
          onClick={async () => {
            await logout();
            onDisconnect();
          }}
        >
          <LogOut className="size-4" />
          Disconnect Wallet
        </Button>
      </div>
    </>
  );
}
