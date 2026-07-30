"use client";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type {
  User,
  ConnectedWallet,
  WalletWithMetadata,
  BaseConnectedWalletType,
} from "@privy-io/react-auth";

import { wallet } from "@/queries";
import DepositView from "./DepositView";
import OverviewView from "./OverviewView";
import WithdrawView from "./WithdrawView";
import TransferView from "./TransferView";
import { useUserApi } from "@/hooks/use-user-api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  createDialogHandle,
} from "@/components/ui/dialog";

type DisconnectWalletDialogProps = Dialog.Props & {
  user?: User | null;
  children?: React.ReactElement;
  activeWallet: ConnectedWallet | BaseConnectedWalletType;
};

const VIEWS = ["overview", "deposit", "transfer", "withdraw"] as const;
type ViewType = (typeof VIEWS)[number];

export const disconnectWalletDialogHandle = createDialogHandle();

export function DisconnectWalletDialog({
  user,
  activeWallet,
  children,
  ...props
}: DisconnectWalletDialogProps) {
  const userApi = useUserApi();
  const { connection } = useConnection();

  const [view, setView] = useState<
    "overview" | "deposit" | "transfer" | "withdraw"
  >("overview");

  const selectedIndex = useMemo(() => VIEWS.indexOf(view), [view]);
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
      address: activeWallet!.address,
    }),
  );

  return (
    <Dialog
      handle={disconnectWalletDialogHandle}
      onOpenChange={(open) => {
        if (!open) setView("overview");
      }}
      {...props}
    >
      {children && <DialogTrigger render={children} />}

      <DialogContent className="sm:max-w-md">
        <TabGroup
          selectedIndex={selectedIndex}
          onChange={(index) => setView(VIEWS[index] as ViewType)}
        >
          <TabList className="hidden">
            {VIEWS.map((view) => (
              <Tab key={view} />
            ))}
          </TabList>
          <TabPanels>
            <TabPanel className="outline-none focus:outline-none">
              <OverviewView
                balances={balances}
                address={activeWallet.address}
                walletClientType={activeWallet.walletClientType}
                isLoadingBalances={isFetching}
                onFetchBalances={refetch}
                onDisconnect={() => {
                  toast.success("Wallet disconnected successfully");
                  disconnectWalletDialogHandle.close();
                }}
                onNavigate={setView}
              />
            </TabPanel>
            <TabPanel className="outline-none focus:outline-none">
              <DepositView
                walletAddress={activeWallet?.address}
                onBack={() => setView("overview")}
              />
            </TabPanel>
            <TabPanel className="outline-none focus:outline-none">
              <TransferView
                userApi={userApi}
                balances={balances}
                onBack={() => setView("overview")}
                onClose={() => {
                  disconnectWalletDialogHandle.close();
                  refetch();
                }}
              />
            </TabPanel>

            <TabPanel className="outline-none focus:outline-none">
              <WithdrawView
                userApi={userApi}
                linkedWallets={linkedWallets}
                balances={balances}
                onBack={() => setView("overview")}
                onClose={() => {
                  disconnectWalletDialogHandle.close();
                  refetch();
                }}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </DialogContent>
    </Dialog>
  );
}
