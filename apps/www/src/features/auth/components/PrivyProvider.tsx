"use client";
import { env } from "@/lib/env";
import { PrivyProvider as PrivyProviderPrimitive } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

type PrivyProviderProps = Partial<
  React.ComponentProps<typeof PrivyProviderPrimitive>
>;

const solanaConnectors = toSolanaWalletConnectors({ shouldAutoConnect: false });

export function PrivyProvider({ children, ...props }: PrivyProviderProps) {
  return (
    <PrivyProviderPrimitive
      appId={env.PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "twitter", "apple", "wallet"],
        appearance: {
          walletChainType: "ethereum-and-solana",
          walletList: [
            "phantom",
            "solflare",
            "backpack",
            "jupiter",
            "coinbase_wallet",
            "okx_wallet",
            "detected_ethereum_wallets",
            "wallet_connect",
          ],
        },
        externalWallets: { solana: { connectors: solanaConnectors } },
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
        },
      }}
      {...props}
    >
      {children}
    </PrivyProviderPrimitive>
  );
}
