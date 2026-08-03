"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";

import { wallet, type ParsedTokenAccount } from "@/queries";
import { useAuth } from "./use-auth";

type UseWalletTokensOptions = Omit<
  UseQueryOptions<ParsedTokenAccount[], Error, ParsedTokenAccount[], string[]>,
  "queryKey" | "queryFn"
> & {
  address?: string;
};

export function useWalletTokens({
  address: overrideAddress,
  enabled = true,
  ...options
}: UseWalletTokensOptions = {}) {
  const { connection } = useConnection();
  const auth = useAuth();

  const address =
    overrideAddress ??
    (auth.authenticated ? (auth.activeWallet?.address ?? "") : "");

  return useQuery<ParsedTokenAccount[], Error, ParsedTokenAccount[], string[]>({
    ...wallet.tokens.queryOptions({ connection, address }),
    ...options,
    enabled: enabled && Boolean(address),
  });
}
