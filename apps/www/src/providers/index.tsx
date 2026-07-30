"use client";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import { PrivyProvider } from "./PrivyProvider";
import { Toaster } from "@/components/ui/sonner";
import UserApiProvider from "./UserApiProvider";
import { queryClient } from "@/lib/query-client";
import { TooltipProvider } from "./ToolTipProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
        <TooltipProvider>
          <PrivyProvider>
            <UserApiProvider>{children}</UserApiProvider>
            <Toaster
              position="top-center"
              richColors
            />
          </PrivyProvider>
        </TooltipProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}
