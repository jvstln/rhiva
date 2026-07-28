import { env } from "@/lib/env";
import {
  useConnectWallet,
  useLoginWithSiws,
  usePrivy,
  useSigners,
  type WalletListEntry,
} from "@privy-io/react-auth";

import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import { toast } from "sonner";

export function useAuth(props?: { onConnectWalletSuccess?: () => void }) {
  const { authenticated, ready, user } = usePrivy();
  const { wallets, ready: solanaReady } = useSolanaWallets();
  const { addSigners } = useSigners();
  const { loginWithSiws, generateSiwsMessage } = useLoginWithSiws();

  // Takes in a callback for logging in onSuccess
  const { connectWallet } = useConnectWallet({
    onSuccess: async ({ wallet }) => {
      const message = await generateSiwsMessage({ address: wallet.address });
      const encodedMessage = new TextEncoder().encode(message);
      const { signature } = await wallets[0].signMessage({
        message: encodedMessage,
      });

      loginWithSiws({ message, signature: String(signature) });

      toast.success(
        `Wallet ${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)} connected successfully`,
      );
      props?.onConnectWalletSuccess?.();
    },
    onError: () => {
      toast.error("Failed to connect wallet");
    },
  });

  async function grantSignerAccess(walletAddress: string) {
    const { user } = await addSigners({
      address: walletAddress,
      signers: [{ signerId: env.PRIVY_SIGNER_ID }],
    });

    return user;
  }

  async function login({ walletEntry }: { walletEntry: WalletListEntry }) {
    connectWallet({
      walletList: [walletEntry],
    });
  }

  async function logout() {
    wallets[0].disconnect();
  }

  return {
    isPending: !ready || !solanaReady,
    isAuthenticated: ready && authenticated,
    grantSignerAccess,
    user,
    wallets,
    connectWallet,
    login,
    logout,
  };
}
