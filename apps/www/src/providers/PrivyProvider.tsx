"use client";
import { env } from "@/lib/env";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { PrivyProvider as PrivyProviderPrimitive } from "@privy-io/react-auth";

import { DisconnectWalletDialog } from "../features/auth/components/DisconnectWalletDialog";

type PrivyProviderProps = Partial<
  React.ComponentProps<typeof PrivyProviderPrimitive>
>;

const solanaConnectors = toSolanaWalletConnectors({ shouldAutoConnect: true });

export function PrivyProvider({ children, ...props }: PrivyProviderProps) {
  return (
    <PrivyProviderPrimitive
      appId={env.PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "twitter", "apple", "wallet"],
        appearance: {
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
      <DisconnectWalletDialog />
    </PrivyProviderPrimitive>
  );
}
