"use client";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import {
  useUser,
  useActiveWallet,
  PrivyProvider as PrivyProviderPrimitive,
} from "@privy-io/react-auth";

import { env } from "@/lib/env";
import { DisconnectWalletDialog } from "@/features/auth/components/DisconnectWalletDialog";

type PrivyProviderProps = Partial<
  React.ComponentProps<typeof PrivyProviderPrimitive>
>;

const solanaConnectors = toSolanaWalletConnectors({ shouldAutoConnect: true });

const InnerPrivyProvider = () => {
  const { user } = useUser();
  const { wallet } = useActiveWallet();

  return (
    wallet && (
      <DisconnectWalletDialog
        user={user}
        activeWallet={wallet}
      />
    )
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
      {children}
      <InnerPrivyProvider />
    </PrivyProviderPrimitive>
  );
}
