"use client";

import { Copy, EyeOff, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type React from "react";
import { useAuth } from "../auth.hook";
import { NetworkSolana } from "@web3icons/react";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

export function UserPopover({
  children,
  ...props
}: Popover.Props & { children: React.ReactElement }) {
  const { logout, wallets } = useAuth();
  const { copy } = useCopyToClipboard();

  return (
    <Popover {...props}>
      <PopoverTrigger render={children} />
      <PopoverContent>
        {/* Balance header */}
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">SOL Balance</span>
          {wallets.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(wallets[0].address)}
            >
              {wallets[0].address.slice(0, 4)}...{wallets[0].address.slice(-4)}
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <NetworkSolana className="size-4" />
          <span className="font-semibold text-2xl">0</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-white/40 text-xs">
          <span>UID: ******</span>
          <Copy className="h-3.5 w-3.5" />
          <EyeOff className="h-3.5 w-3.5" />
        </div>

        <Separator />

        <Button variant="ghost" onClick={logout}>
          <LogOut />
          Disconnect
        </Button>
      </PopoverContent>
    </Popover>
  );
}
