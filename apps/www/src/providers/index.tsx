"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import { env } from "@/lib/env";
import { PrivyProvider } from "./PrivyProvider";
import UserApiProvider from "./UserApiProvider";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";
import { TooltipProvider } from "./ToolTipProvider";
import { AuthProtection } from "@/components/layout/AuthProtection";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={env.solanaRpcUrl}>
        <TooltipProvider>
          <PrivyProvider>
            <UserApiProvider>
              <AuthProtection />
              {children}
              <Toaster
                position="top-center"
                richColors
              />
            </UserApiProvider>
          </PrivyProvider>
        </TooltipProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}
