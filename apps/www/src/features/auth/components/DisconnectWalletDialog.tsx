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
import { useWallets } from "@privy-io/react-auth";
import { truncate } from "lodash";
import CopyButton from "@/components/ui/button/copy-button";
import { ConnectWalletDialog } from "./ConnectWalletDialog";

type DisconnectWalletDialogProps = Dialog.Props & {
  children?: React.ReactElement;
};

const dialogHandle = createDialogHandle();

export function DisconnectWalletDialog({
  children,
  ...props
}: DisconnectWalletDialogProps) {
  const { wallets } = useWallets();
  const currentWallet = wallets[0];

  return (
    <Dialog
      handle={dialogHandle}
      {...props}
    >
      {children && <DialogTrigger render={children} />}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Wallet</DialogTitle>
        </DialogHeader>

        <DialogDescription>Connected wallet</DialogDescription>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {currentWallet?.address
              ? truncate(currentWallet.address, { length: 24 })
              : "N/A"}
            <CopyButton copy={currentWallet?.address} />
          </div>
          <div className="flex gap-2">
            <ConnectWalletDialog>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  currentWallet.disconnect();
                  dialogHandle.close();
                  toast.success("Wallet disconnected successfully");
                }}
              >
                Disconnect
              </Button>
            </ConnectWalletDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
