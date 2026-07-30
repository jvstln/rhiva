"use client";
import { createContext, useEffect, useMemo } from "react";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import {
  useUser,
  useSigners,
  PrivyProvider as PrivyProviderPrimitive,
  type ConnectedWallet,
  type WalletWithMetadata,
  type BaseConnectedWalletType,
  usePrivy,
} from "@privy-io/react-auth";

import { env } from "@/lib/env";
import { DisconnectWalletDialog } from "@/features/auth/components/DisconnectWalletDialog";

type PrivyProviderProps = Partial<
  React.ComponentProps<typeof PrivyProviderPrimitive>
>;

const solanaConnectors = toSolanaWalletConnectors({ shouldAutoConnect: true });

export type TAuthContext =
  | {
      authenticated: true;
      activeWallet: WalletWithMetadata;
    }
  | { authenticated: false };

export const AuthContext = createContext<TAuthContext | null>(null);

const InnerPrivyProvider = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();
  const { addSigners } = useSigners();
  const { authenticated } = usePrivy();

  const activeWallet = useMemo(
    () =>
      user?.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
          account.type === "wallet" && account.delegated,
      ),
    [user],
  );

  useEffect(() => {
    const embeddedWallets = user?.linkedAccounts.filter(
      (account): account is WalletWithMetadata =>
        account.type === "wallet" && account.connectorType === "embedded",
    );
    if (embeddedWallets && embeddedWallets.length > 0) {
      embeddedWallets
        .filter((wallet) => !wallet.delegated)
        .map((embeddedWallet) =>
          addSigners({
            address: embeddedWallet.address,
            signers: [{ signerId: env.PRIVY_SIGNER_ID }],
          }),
        );
    }
  }, [user, addSigners]);

  return (
    <AuthContext.Provider
      value={{ authenticated, activeWallet: activeWallet! }}
    >
      {children}
      {activeWallet && (
        <DisconnectWalletDialog
          user={user}
          activeWallet={
            activeWallet as unknown as ConnectedWallet | BaseConnectedWalletType
          }
        />
      )}
    </AuthContext.Provider>
  );
};

export function PrivyProvider({ children, ...props }: PrivyProviderProps) {
  return (
    <PrivyProviderPrimitive
      appId={env.PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "twitter", "apple", "wallet"],
        appearance: {
          theme: "dark",
          showWalletLoginFirst: true,
          walletChainType: "solana-only",
          walletList: [
            "phantom",
            "solflare",
            "backpack",
            "jupiter",
            "coinbase_wallet",
            "okx_wallet",
            "wallet_connect",
          ],
        },

        externalWallets: { solana: { connectors: solanaConnectors } },
        embeddedWallets: {
          solana: { createOnLogin: "all-users" },
        },
      }}
      {...props}
    >
      <InnerPrivyProvider>{children}</InnerPrivyProvider>
    </PrivyProviderPrimitive>
  );
}
