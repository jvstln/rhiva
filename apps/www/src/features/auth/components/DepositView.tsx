import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/button/copy-button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DepositViewProps {
  walletAddress: string;
  onBack: () => void;
}

export default function DepositView({
  walletAddress,
  onBack,
}: DepositViewProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-8 rounded-full"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle>Deposit Token</DialogTitle>
        </div>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-5 py-3">
        <div className="flex size-52 items-center justify-center rounded-xl border bg-white p-4 shadow-md">
          <QRCodeSVG
            value={walletAddress}
            className="size-44"
          />
        </div>
        <div className="w-full space-y-2 text-center">
          <p className="text-muted-foreground text-xs">
            Scan QR code or copy address to deposit
          </p>
          <div className="flex max-w-full items-center justify-center gap-2 overflow-hidden rounded-lg border bg-muted/30 p-3">
            <span className="select-all truncate font-mono text-xs">
              {walletAddress}
            </span>
            <CopyButton copy={walletAddress} />
          </div>
        </div>
        <div className="mt-2 flex w-full items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 p-3 text-primary/80 text-xs">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Send only solana tokens to this address. Sending other assets may
            result in permanent loss.
          </p>
        </div>
      </div>
    </>
  );
}
