"use client";

import { toast } from "sonner";
import {
  usePrivy,
  type User,
  type WalletWithMetadata,
} from "@privy-io/react-auth";
import { ArrowDownLeft, LogOut, PlusCircle, Send, Wallet } from "lucide-react";

import { Button, CopyButton } from "@/components/ui/button";
import { SendDialog } from "@/features/transaction/components/SendDialog";
import { DepositDialog } from "@/features/transaction/components/DepositDialog";
import { WithdrawDialog } from "@/features/transaction/components/WithdrawDialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type UserMenuPopoverProps = Popover.Props & {
  user: User;
  activeWallet: WalletWithMetadata;
  children?: React.ReactElement;
};

export function UserMenuPopover({
  user,
  activeWallet,
  children,
  ...props
}: UserMenuPopoverProps) {
  const { logout } = usePrivy();

  return (
    <Popover {...props}>
      {children && <PopoverTrigger render={children} />}

      <PopoverContent>
        <div className="space-y-5 py-3">
          <div className="rounded-xl border bg-card p-5 text-card-foreground">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Wallet className="size-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base leading-none">
                  {activeWallet.walletClientType === "privy"
                    ? "Embedded Wallet"
                    : activeWallet.walletClientType || "Connected Wallet"}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="truncate font-mono">
                    {activeWallet.address.slice(0, 8)}...
                    {activeWallet.address.slice(-8)}
                  </span>
                  {activeWallet.address && (
                    <CopyButton copy={activeWallet.address} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <DepositDialog address={activeWallet.address}>
              <Button
                className="h-20 flex-col rounded-xl"
                variant="outline"
                size="lg"
              >
                <PlusCircle /> Deposit
              </Button>
            </DepositDialog>
            <SendDialog activeWallet={activeWallet}>
              <Button
                className="h-20 flex-col rounded-xl"
                variant="outline"
                size="lg"
              >
                <Send /> Transfer
              </Button>
            </SendDialog>
            <WithdrawDialog activeWallet={activeWallet}>
              <Button
                className="h-20 flex-col rounded-xl"
                variant="outline"
                size="lg"
              >
                <ArrowDownLeft /> Withdraw
              </Button>
            </WithdrawDialog>
          </div>

          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={async () => {
              await logout();
              toast.success("Wallet disconnected successfully");
            }}
          >
            <LogOut />
            Disconnect Wallet
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
