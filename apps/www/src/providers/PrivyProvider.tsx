"use client";

import { createContext, useEffect, useMemo } from "react";
import {
  useUser,
  usePrivy,
  useSigners,
  PrivyProvider as PrivyProviderPrimitive,
  type WalletWithMetadata,
} from "@privy-io/react-auth";

import { env } from "@/lib/env";

type PrivyProviderProps = Partial<
  React.ComponentProps<typeof PrivyProviderPrimitive>
>;

export type TAuthContext =
  | {
      ready: boolean;
      authenticated: true;
      activeWallet: WalletWithMetadata;
    }
  | {
      ready: boolean;
      authenticated: false;
    };

export const AuthContext = createContext<TAuthContext | null>(null);

const InnerPrivyProvider = ({ children }: React.PropsWithChildren) => {
  const { ready } = usePrivy();
  const { user } = useUser();
  const { addSigners } = useSigners();

  const activeWallet = useMemo(
    () =>
      user?.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
          account.type === "wallet" && Boolean(account.delegated),
      ) ??
      user?.linkedAccounts.find(
        (account): account is WalletWithMetadata => account.type === "wallet",
      ) ??
      (user?.wallet as WalletWithMetadata | undefined) ??
      null,
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
            signers: [{ signerId: env.privySignerId }],
          }),
        );
    }
  }, [user, addSigners]);

  return (
    <AuthContext.Provider
      value={{
        ready,
        authenticated: Boolean(activeWallet),
        activeWallet: activeWallet!,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function PrivyProvider({ children, ...props }: PrivyProviderProps) {
  return (
    <PrivyProviderPrimitive
      appId={env.privyAppId}
      config={{
        loginMethods: ["email", "google"],
        appearance: {
          theme: "dark",
          showWalletLoginFirst: false,
        },
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
