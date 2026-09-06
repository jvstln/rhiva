import UserApi from "@rhivadotfun/userapi";
import { useToken } from "@privy-io/react-auth";
import { createContext, useEffect, useState } from "react";

import { env } from "@/lib";
import { useAuth } from "@/hooks";

export const UserApiContext = createContext<UserApi | null>(null);

export default function UserApiProvider({ children }: React.PropsWithChildren) {
  const auth = useAuth();
  const [userApi, setUserApi] = useState<UserApi | null>(null);
  const { getAccessToken } = useToken({
    onAccessTokenRemoved() {
      setUserApi(null);
    },
    onAccessTokenGranted({ accessToken }) {
      if (auth.authenticated && auth.activeWallet?.address) {
        setUserApi(
          new UserApi(env.userApiUrl, accessToken, auth.activeWallet.address),
        );
      }
    },
  });

  useEffect(() => {
    let cancelled = false;
    if (auth.authenticated && auth.activeWallet?.address) {
      getAccessToken().then((accessToken) => {
        if (!cancelled && accessToken) {
          setUserApi(
            new UserApi(env.userApiUrl, accessToken, auth.activeWallet.address),
          );
        }
      });
    } else {
      setUserApi(null);
    }
    return () => {
      cancelled = true;
    };
  }, [auth, getAccessToken]);

  return (
    <UserApiContext.Provider value={userApi}>
      {children}
    </UserApiContext.Provider>
  );
}
