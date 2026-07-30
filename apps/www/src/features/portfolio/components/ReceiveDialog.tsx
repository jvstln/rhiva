"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCode } from "react-qr-code";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

export function ReceiveDialog({
  open,
  onOpenChange,
  children,
}: Dialog.Props & { children?: React.ReactElement }) {
  const { copy } = useCopyToClipboard();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={"Waller address"}
            viewBox={`0 0 256 256`}
          />
        </div>

        <DialogFooter className="flex sm:flex-col">
          <p className="text-center text-muted-foreground">
            Only send Solana Network tokens (SPL) to this address
          </p>
          <Button
            className="w-full"
            onClick={() => copy("Wallet address")}
          >
            Copy addess
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
