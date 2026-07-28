"use client";

import {
  TokenJUP,
  WalletBackpack,
  WalletCoinbase,
  WalletOkx,
  WalletPhantom,
  WalletSolflare,
  WalletWalletConnect,
} from "@web3icons/react";
import { siApple, siGoogle, siX } from "simple-icons";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SimpleIcon } from "@/components/ui/icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Item, ItemFooter, ItemHeader, ItemMedia } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import type { WalletListEntry } from "@privy-io/react-auth";
import { SocialAuthDialog } from "./SocialAuthDialog";
import { useAuth } from "../auth.hook";

interface WalletEntry {
  id: WalletListEntry | "socials";
  name?: string;
  icon: React.ReactNode;
}

function WalletButton({
  entry,
  size = "default",
  ...props
}: React.ComponentProps<"button"> & {
  entry: WalletEntry;
  size?: "default" | "sm";
}) {
  return (
    <button type="button" {...props}>
      <Item variant={"outline"} size={size} className="h-full">
        <ItemHeader className="justify-center">
          <ItemMedia variant={"image"}>{entry.icon}</ItemMedia>
        </ItemHeader>
        {entry.name && (
          <ItemFooter className="justify-center text-center">
            {entry.name}
          </ItemFooter>
        )}
      </Item>
    </button>
  );
}

function WalletSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="font-medium text-foreground text-sm">{title}</p>
      <div className="flex flex-wrap gap-4 *:w-fit *:max-w-23 *:grow-0">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1: wallet list                                                  */
/* ------------------------------------------------------------------ */

const recentlyUsed: WalletEntry[] = [
  {
    icon: <WalletSolflare />,
    id: "solflare",
    name: "Solflare",
  },
];

const recommended: WalletEntry[] = [
  {
    id: "jupiter",
    name: "Jupiter",
    icon: <TokenJUP />,
  },
  {
    id: "socials",
    name: "Socials",
    icon: (
      <div className="grid grid-cols-2 gap-1">
        <SimpleIcon icon={siGoogle} className="size-3.25" />
        <SimpleIcon icon={siX} fill="#ffffff" className="size-3.25" />
        <SimpleIcon icon={siApple} fill="#ffffff" className="size-3.25" />
      </div>
    ),
  },
];

const topWallet: WalletEntry[] = [
  {
    id: "jupiter",
    name: "Jupiter",
    icon: <TokenJUP />,
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: <WalletPhantom />,
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: <WalletBackpack />,
  },
  {
    id: "coinbase_wallet",
    name: "Coinbase",
    icon: <WalletCoinbase />,
  },
  {
    id: "okx_wallet",
    name: "OKX Wallet",
    icon: <WalletOkx className="**:fill-white" />,
  },
];

const reownWalletConnect: WalletEntry[] = [
  {
    id: "wallet_connect",
    name: "Wallet Connect",
    icon: <WalletWalletConnect />,
  },
];

const moreWallets: WalletEntry[] = [];

const walletSections: Array<{ title: string; entries: WalletEntry[] }> = [
  { title: "Recently Used", entries: recentlyUsed },
  { title: "Recommended", entries: recommended },
  { title: "Top Wallet", entries: topWallet },
  { title: "Reown/Wallet Connect", entries: reownWalletConnect },
  { title: "More Wallets", entries: moreWallets },
];

/* ------------------------------------------------------------------ */
/* Dialog shell                                                         */
/* ------------------------------------------------------------------ */

type ConnectWalletDialogProps = Dialog.Props & {
  children?: React.ReactElement;
};

export const connectWalletDialogHandle = createDialogHandle();

export function ConnectWalletDialog({
  children,
  ...props
}: ConnectWalletDialogProps) {
  const { login } = useAuth({
    onConnectWalletSuccess: () => {
      connectWalletDialogHandle.close();
    },
  });

  const handleConnectWallet = (walletEntry: WalletListEntry) => {
    // connectWallet({ walletList: [wallet] });
    login({ walletEntry });
  };

  return (
    <Dialog handle={connectWalletDialogHandle} {...props}>
      {children && <DialogTrigger render={children} />}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Connect Wallet</DialogTitle>
        </DialogHeader>

        <p className="mb-5 text-muted-foreground text-sm">
          By connecting your wallet, you are confirming that you understand and
          accept the{" "}
          <Button variant="link" className="h-auto p-0">
            terms of service
          </Button>
        </p>

        <ScrollArea className="-mx-(--padding-x) max-h-105 px-(--padding-x)">
          <div className="space-y-6 pr-1">
            {walletSections.map((section) => {
              if (section.entries.length === 0) return null;

              return (
                <WalletSection key={section.title} title={section.title}>
                  {section.entries.map((entry) => {
                    if (entry.id === "socials") {
                      return (
                        <SocialAuthDialog>
                          <WalletButton
                            key={entry.id}
                            entry={entry}
                            size={
                              section.title === "More Wallets"
                                ? "sm"
                                : "default"
                            }
                          />
                        </SocialAuthDialog>
                      );
                    }

                    return (
                      <WalletButton
                        key={entry.id}
                        entry={entry}
                        size={
                          section.title === "More Wallets" ? "sm" : "default"
                        }
                        onClick={() => {
                          return (
                            entry.id !== "socials" &&
                            handleConnectWallet(entry.id)
                          );
                        }}
                      />
                    );
                  })}
                </WalletSection>
              );
            })}
          </div>

          <ScrollBar showScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
