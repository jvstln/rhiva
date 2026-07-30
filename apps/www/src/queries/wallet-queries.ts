import { queryOptions } from "@tanstack/react-query";
import { type Connection, PublicKey } from "@solana/web3.js";
import {
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import { type Token, tokens } from "./token-queries";

export type ParsedTokenAccount = {
  metadata: Token;
  info: {
    mint: string;
    owner: string;
    state: "initialized";
    tokenAmount: {
      amount: string;
      decimals: number;
      uiAmount: number;
      uiAmountString: string;
    };
    type: "account";
  } & ({ isNative: true } | { isNative: false; programId: string });
};

type GetWalletTokensParams = {
  address: string;
  connection: Connection;
};

export const wallet = {
  tokens: {
    queryKey(params: Pick<GetWalletTokensParams, "address">) {
      return ["wallet", "tokens", params.address];
    },
    queryOptions({ connection, ...params }: GetWalletTokensParams) {
      const address = new PublicKey(params.address);
      return queryOptions({
        queryKey: this.queryKey(params),
        async queryFn(): Promise<ParsedTokenAccount[]> {
          const [nativeBalance, ...nestedTokenAccountsByOwner] =
            await Promise.all([
              connection.getBalance(address),
              ...[TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].map((programId) =>
                connection
                  .getParsedTokenAccountsByOwner(address, { programId })
                  .then(({ value }) => value),
              ),
            ]);

          const tokenAccountsbyOwner = nestedTokenAccountsByOwner.flat();

          const tokenBalances: ParsedTokenAccount["info"][] = [
            {
              isNative: true,
              state: "initialized",
              owner: address.toBase58(),
              mint: NATIVE_MINT.toBase58(),
              tokenAmount: {
                decimals: 9,
                amount: nativeBalance.toString(),
                uiAmount: nativeBalance / 1e9,
                uiAmountString: (nativeBalance / 1e9).toString(),
              },
              type: "account",
            },
            ...tokenAccountsbyOwner.map((value) => {
              const tokenBalance = {
                ...value.account.data.parsed.info,
                programId: value.account.owner.toBase58(),
              } as ParsedTokenAccount["info"];
              return tokenBalance;
            }),
          ];

          const metadatas: Record<string, Token> = {};
          const mints = tokenBalances.map((tokenBalance) => tokenBalance.mint);
          if (mints.length > 0) {
            const tokenMetadatas = await tokens.multi.queryFn({ mints });
            for (const metadata of tokenMetadatas) {
              metadatas[metadata.mint] = metadata;
            }
          }

          return tokenBalances.map((tokenBalance) => {
            const metadata = metadatas[tokenBalance.mint]!;
            return {
              metadata,
              info: tokenBalance,
            };
          });
        },
      });
    },
  },
};
