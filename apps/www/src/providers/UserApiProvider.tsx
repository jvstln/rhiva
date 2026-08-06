import UserApi from "@rhivadotfun/userapi";
import { useToken } from "@privy-io/react-auth";
import { createContext, useEffect, useRef } from "react";

import { env } from "@/lib";
import { useAuth } from "@/hooks";

export const UserApiContext = createContext<UserApi | null>(null);

export default function UserApiProvider({ children }: React.PropsWithChildren) {
  const auth = useAuth();
  const userApi = useRef<UserApi | null>(null);
  const { getAccessToken } = useToken({
    onAccessTokenRemoved() {},
    onAccessTokenGranted({ accessToken }) {
      if (auth.authenticated)
        userApi.current = new UserApi(
          env.userApiUrl,
          accessToken,
          auth.activeWallet.address,
        );
    },
  });

  useEffect(() => {
    if (auth)
      getAccessToken().then((accessToken) => {
        if (accessToken && auth.authenticated)
          userApi.current = new UserApi(
            env.userApiUrl,
            accessToken,
            auth.activeWallet.address,
          );
      });
  }, [auth, getAccessToken]);

  return (
    <UserApiContext.Provider value={userApi.current}>
      {children}
    </UserApiContext.Provider>
  );
}
