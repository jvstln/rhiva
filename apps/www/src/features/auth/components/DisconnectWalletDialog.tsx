"use client";

import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CopyButton from "@/components/ui/button/copy-button";
import { useAuth } from "../auth.hook";

type DisconnectWalletDialogProps = Dialog.Props & {
  children?: React.ReactElement;
};

export const disconnectWalletDialogHandle = createDialogHandle();

export function DisconnectWalletDialog({
  children,
  ...props
}: DisconnectWalletDialogProps) {
  const { wallets } = useAuth();
  const currentWallet = wallets[0];

  return (
    <Dialog handle={disconnectWalletDialogHandle} {...props}>
      {children && <DialogTrigger render={children} />}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Wallet</DialogTitle>
        </DialogHeader>

        <DialogDescription>Connected wallet</DialogDescription>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {currentWallet?.address
              ? `${currentWallet.address.slice(0, 24)}...`
              : "N/A"}
            <CopyButton copy={currentWallet?.address} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                currentWallet?.disconnect();
                toast.success("Wallet disconnected successfully");
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
