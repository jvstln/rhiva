"use client";

import type * as React from "react";
import { QRCode } from "react-qr-code";
import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DepositDialog({
  address,
  children,
  ...props
}: Dialog.Props & { children?: React.ReactElement; address: string }) {
  const { copy } = useCopyToClipboard();

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive</DialogTitle>
        </DialogHeader>

        <div className="rounded-md bg-foreground p-4">
          <QRCode
            size={128}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={address}
            viewBox={`0 0 128 128`}
          />
        </div>

        <DialogFooter className="flex sm:flex-col">
          <Alert className="border border-amber-700 bg-amber-950/20 text-amber-100">
            <AlertTriangleIcon />
            <AlertTitle>
              Only send Solana Network tokens (SPL) to this address
            </AlertTitle>
            <AlertDescription>
              Send only solana tokens to this address. Sending other assets may
              result in permanent loss.
            </AlertDescription>
          </Alert>
          <p className="text-center text-muted-foreground"></p>
          <Button
            className="w-full"
            onClick={() => copy(address)}
          >
            Copy addess
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
