"use client";

import { useEffect } from "react";
import { useLogin } from "@privy-io/react-auth";

import { useAuth } from "@/hooks";

export function AuthProtection() {
  const auth = useAuth();
  const { login } = useLogin();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const requireAuthElement = target.closest("[data-require-auth]");

      if (requireAuthElement && !auth.authenticated) {
        event.preventDefault();
        event.stopPropagation();
        login({ walletChainType: "solana-only" });
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [auth.authenticated, login]);

  return null;
}
