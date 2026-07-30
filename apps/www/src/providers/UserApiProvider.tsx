import UserApi from "@rhivadotfun/userapi";
import { createContext, useEffect, useRef } from "react";
import { useToken, useActiveWallet } from "@privy-io/react-auth";

export const UserApiContext = createContext<UserApi | null>(null);

export default function UserApiProvider({ children }: React.PropsWithChildren) {
  const userApi = useRef<UserApi | null>(null);
  const { wallet } = useActiveWallet();
  const { getAccessToken } = useToken({
    onAccessTokenRemoved() {},
    onAccessTokenGranted({ accessToken }) {
      if (wallet)
        userApi.current = new UserApi("", accessToken, wallet.address);
    },
  });

  useEffect(() => {
    if (wallet)
      getAccessToken().then((accessToken) => {
        if (accessToken) {
          userApi.current = new UserApi("", accessToken, wallet.address);
        }
      });
  }, [wallet, getAccessToken]);

  return (
    <UserApiContext.Provider value={userApi.current}>
      {children}
    </UserApiContext.Provider>
  );
}
