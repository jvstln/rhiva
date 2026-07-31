"use client";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import type { User, WalletWithMetadata } from "@privy-io/react-auth";

import { wallet } from "@/queries";
import DepositView from "./DepositView";
import OverviewView from "./OverviewView";
import WithdrawView from "./WithdrawView";
import TransferView from "./TransferView";
import { useUserApi } from "@/hooks/use-user-api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  createDialogHandle,
} from "@/components/ui/dialog";

type UserMenuDialogProps = Dialog.Props & {
  user: User;
  activeWallet: WalletWithMetadata;
  children?: React.ReactElement;
};

const VIEWS = ["overview", "deposit", "transfer", "withdraw"] as const;
type ViewType = (typeof VIEWS)[number];

const userMenuDialogHandle = createDialogHandle();

export function UserMenuDialog({
  user,
  activeWallet,
  children,
  ...props
}: UserMenuDialogProps) {
  const userApi = useUserApi();
  const { connection } = useConnection();
  const [view, setView] = useState<ViewType>("overview");

  const linkedWallets = useMemo(
    () =>
      user?.linkedAccounts?.filter(
        (account) =>
          account.type === "wallet" &&
          account.address?.toLowerCase() !==
            activeWallet?.address?.toLowerCase(),
      ) as WalletWithMetadata[],
    [user, activeWallet],
  );

  const {
    data: balances,
    isFetching,
    refetch,
  } = useQuery(
    wallet.tokens.queryOptions({
      connection,
      address: activeWallet?.address ?? "",
    }),
  );

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setView("overview");
      }}
      {...props}
    >
      {children && <DialogTrigger render={children} />}

      <DialogContent className="sm:max-w-md">
        <Tabs
          value={view}
          onValueChange={(value) => setView(value)}
        >
          <TabsContent value="overview">
            <OverviewView
              balances={balances}
              address={activeWallet.address}
              walletClientType={activeWallet.walletClientType}
              isLoadingBalances={isFetching}
              onFetchBalances={refetch}
              onDisconnect={() => {
                toast.success("Wallet disconnected successfully");
                userMenuDialogHandle.close();
              }}
              onNavigate={setView}
            />
          </TabsContent>

          <TabsContent value="deposit">
            <DepositView
              walletAddress={activeWallet.address}
              onBack={() => setView("overview")}
            />
          </TabsContent>

          <TabsContent value="transfer">
            <TransferView
              userApi={userApi}
              balances={balances}
              onBack={() => setView("overview")}
              onClose={() => {
                userMenuDialogHandle.close();
                refetch();
              }}
            />
          </TabsContent>

          <TabsContent value="withdraw">
            <WithdrawView
              userApi={userApi}
              linkedWallets={linkedWallets}
              balances={balances}
              onBack={() => setView("overview")}
              onClose={() => {
                userMenuDialogHandle.close();
                refetch();
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
