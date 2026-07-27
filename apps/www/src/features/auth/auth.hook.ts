import { env } from "@/lib/env";
import {
  useConnectWallet,
  usePrivy,
  useSigners,
  useWallets,
} from "@privy-io/react-auth";
import { toast } from "sonner";

export function useAuth(props?: { onConnectWalletSuccess?: () => void }) {
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { addSigners } = useSigners();

  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
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

  return {
    isPending: !ready,
    isAuthenticated: ready && authenticated,
    grantSignerAccess,
    user,
    wallets,
    connectWallet,
  };
}
