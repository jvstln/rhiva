import { usePrivy, useWallets } from "@privy-io/react-auth";

export function useAuth() {
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();

  return {
    authenticated: ready && authenticated,
    ready,
    user,
    wallets,
  };
}
