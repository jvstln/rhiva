import { useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

export enum SignatureStatus {
  Expired,
  Error,
  Successful,
}

type UseSignatureParams = {
  signature: string;
  lastValidBlockHeight?: number;
};

export const useSignature = () => {
  const { connection } = useConnection();
  return useCallback(
    async ({ signature, ...params }: UseSignatureParams) => {
      const lastValidBlockHeight = params.lastValidBlockHeight
        ? params.lastValidBlockHeight
        : await connection
            .getLatestBlockhash()
            .then(({ lastValidBlockHeight }) => lastValidBlockHeight);

      while (true) {
        const lastestValidBlockHeight = (await connection.getLatestBlockhash())
          .lastValidBlockHeight;
        if (lastestValidBlockHeight > lastValidBlockHeight)
          return SignatureStatus.Expired;
        const signatureStatus = await connection.getSignatureStatus(signature);
        if (signatureStatus.value) {
          const { err } = signatureStatus.value;
          if (err) return SignatureStatus.Error;
          return SignatureStatus.Successful;
        }
      }
    },
    [connection],
  );
};
