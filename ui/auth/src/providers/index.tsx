import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { createContext, useCallback } from "react";

type AuthProviderProps = {} & Omit<
  React.ComponentProps<typeof PrivyProvider>,
  "children"
>;

type TAuthContext = {
  showAuthModal(): void;
};

export const AuthContext = createContext<TAuthContext | null>(null);

export default function AuthProvider({
  children,
  ...props
}: React.PropsWithChildren<AuthProviderProps>) {
  const { authenticated } = usePrivy();

  const showAuthModal = useCallback(() => {
    if (authenticated) return;
  }, [authenticated]);

  return (
    <PrivyProvider {...props}>
      <AuthContext.Provider value={{ showAuthModal }}>
        {children}
      </AuthContext.Provider>
    </PrivyProvider>
  );
}
