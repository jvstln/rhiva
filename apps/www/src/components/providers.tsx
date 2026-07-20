"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { TooltipProvider } from "./tooltip.provider";
import { Toaster } from "./ui/sonner";
import { PrivyProvider } from "../features/auth/components/PrivyProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PrivyProvider>
          {children}
          <Toaster
            position="top-center"
            richColors
          />
        </PrivyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
