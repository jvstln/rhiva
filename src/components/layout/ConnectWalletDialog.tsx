"use client";

import {
  NetworkEthereum,
  TokenJUP,
  WalletBackpack,
  WalletCoinbase,
  WalletMetamask,
  WalletOkx,
  WalletPhantom,
  WalletSolflare,
  WalletWalletConnect,
} from "@web3icons/react";
import { ArrowUpRight, ChevronLeft, Mail, Waves } from "lucide-react";
import { useState } from "react";
import { siApple, siGoogle, siX } from "simple-icons";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SimpleIcon } from "../ui/icons";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

/** Placeholder for wallet brands not available in simple-icons. */
function _FallbackGlyph({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return <span className={cn("font-bold text-sm", className)}>{label}</span>;
}

/* ------------------------------------------------------------------ */
/* Wallet tile primitives                                               */
/* ------------------------------------------------------------------ */

interface WalletEntry {
  id: string;
  name?: string;
  icon: React.ReactNode;
  onSelect?: () => void;
}

function WalletTile({
  entry,
  size = "default",
}: {
  entry: WalletEntry;
  size?: "default" | "sm";
}) {
  return (
    <button
      type="button"
      onClick={entry.onSelect}
      className={cn("flex flex-col items-center gap-2 text-center", {
        "w-24": size === "default",
        "w-12": size === "sm",
      })}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-2xl border border-border [&_svg]:not-[[class*=size]]:size-8",
          {
            "size-16": size === "default",
            "size-12": size === "sm",
          },
        )}
      >
        {entry.icon}
      </span>
      {entry.name && (
        <span className="text-foreground text-sm">{entry.name}</span>
      )}
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
      <div className="flex flex-wrap gap-4 *:w-fit *:max-w-23 *:grow-0 *:items-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1: wallet list                                                  */
/* ------------------------------------------------------------------ */

function WalletListStep({ onSelectSocials }: { onSelectSocials: () => void }) {
  const recommended: WalletEntry[] = [
    {
      id: "jupiter-recommended",
      name: "Jupiter",
      icon: <TokenJUP />,
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
      id: "coinbase",
      name: "Coinbase",
      icon: <WalletCoinbase />,
    },
    {
      id: "okx",
      name: "OKX Wallet",
      icon: <WalletOkx className="**:fill-white" />,
    },
  ];

  const reownWalletConnect: WalletEntry[] = [
    {
      id: "wallet-connect",
      name: "Wallet Connect",
      icon: <WalletWalletConnect />,
    },
  ];

  const moreWallets: WalletEntry[] = [
    {
      id: "metamask-1",
      icon: <WalletMetamask />,
    },
    {
      id: "ethereum-1",
      icon: <NetworkEthereum />,
    },
  ];

  return (
    <ScrollArea className="-mx-(--padding-x) max-h-[70vh] px-(--padding-x)">
      <div className="space-y-6 pr-1">
        <WalletSection title="Recently Used">
          <WalletTile
            entry={{
              icon: <WalletSolflare />,
              id: "solflare",
              name: "Solflare",
            }}
          />
        </WalletSection>
        <WalletSection title="Recommended">
          {recommended.map((entry) => (
            <WalletTile key={entry.id} entry={entry} />
          ))}
        </WalletSection>
        <WalletSection title="Top Wallet">
          {topWallet.map((entry) => (
            <WalletTile key={entry.id} entry={entry} />
          ))}
        </WalletSection>
        <WalletSection title="Reown/Wallet Connect">
          <WalletTile
            entry={{
              id: "socials",
              name: "Socials",
              icon: (
                <div className="grid grid-cols-2 gap-1">
                  <SimpleIcon icon={siGoogle} className="size-4" />
                  <SimpleIcon icon={siX} fill="#ffffff" className="size-4" />
                  <SimpleIcon
                    icon={siApple}
                    fill="#ffffff"
                    className="size-4"
                  />
                </div>
              ),
              onSelect: onSelectSocials,
            }}
          />
          {reownWalletConnect.map((entry) => (
            <WalletTile key={entry.id} entry={entry} />
          ))}
        </WalletSection>
        <div className="space-y-3">
          <p className="font-medium text-foreground text-sm">More Wallets</p>
          <div className="flex flex-wrap gap-3">
            {moreWallets.map((entry) => (
              <WalletTile size="sm" key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>

      <ScrollBar showScrollBar />
    </ScrollArea>
  );
}

/* ------------------------------------------------------------------ */
/* Shared: social buttons                                               */
/* ------------------------------------------------------------------ */

function GoogleButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl bg-surface-2 px-5 py-4 font-medium text-foreground transition-colors hover:bg-surface-3"
    >
      <SimpleIcon icon={siGoogle} className="size-5" />
      Continue With Google
    </button>
  );
}

function XAndAppleButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex items-center justify-center rounded-xl bg-surface-2 py-4 transition-colors hover:bg-surface-3"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-black">
          <SimpleIcon icon={siX} color="#ffffff" className="size-4" />
        </span>
      </button>
      <button
        type="button"
        className="flex items-center justify-center rounded-xl bg-surface-2 py-4 transition-colors hover:bg-surface-3"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-black">
          <SimpleIcon icon={siApple} color="#ffffff" className="size-4" />
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2: social login                                                 */
/* ------------------------------------------------------------------ */

function SocialLoginStep({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="space-y-3">
      <GoogleButton />
      <XAndAppleButtons />

      <p className="pt-2 text-center text-muted-foreground text-sm">
        Haven't got a wallet?{" "}
        <button
          type="button"
          onClick={onGetStarted}
          className="font-medium text-primary hover:underline"
        >
          Get started
        </button>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3: email                                                        */
/* ------------------------------------------------------------------ */

function EmailStep() {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 rounded-xl bg-surface-2 px-5 py-4">
        <Mail className="size-4 text-muted-foreground" />
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <GoogleButton />
      <XAndAppleButtons />

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-sm">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Looking for a self-custody wallet?
      </p>

      <button
        type="button"
        className="mx-auto flex items-center gap-2 rounded-full bg-surface-2 px-5 py-2.5 text-foreground text-sm transition-colors hover:bg-surface-3"
      >
        <Waves className="size-4" />
        Find on WalletGuide
        <ArrowUpRight className="size-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog shell                                                         */
/* ------------------------------------------------------------------ */

type ConnectStep = "wallets" | "social" | "email";

type ConnectWalletDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactElement;
};

const dialogHandle = createDialogHandle();

export function ConnectWalletDialog({
  open,
  onOpenChange,
  children,
}: ConnectWalletDialogProps) {
  const [step, setStep] = useState<ConnectStep>("wallets");

  return (
    <Dialog
      handle={dialogHandle}
      open={open}
      onOpenChange={(...args) => {
        onOpenChange?.(...args);
        if (args[0]) {
          // Reset to the root step next time the dialog opens.
          setStep("wallets");
        }
      }}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent className={cn("gap-0 border-border bg-background")}>
        <div className="mb-5 grid grid-cols-[24px_1fr_24px] items-center">
          {step === "email" ? (
            <button
              type="button"
              onClick={() => setStep("social")}
              aria-label="Back"
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : (
            <span />
          )}

          <DialogTitle className="text-center font-semibold text-foreground text-xl">
            Connect Wallet
          </DialogTitle>
        </div>

        {step === "wallets" && (
          <>
            <p className="mb-5 text-muted-foreground text-sm">
              By connecting your wallet, you are confirming that you understand
              and accept the{" "}
              <button
                type="button"
                className="font-medium text-foreground underline"
              >
                terms of service
              </button>
              .
            </p>
            <WalletListStep onSelectSocials={() => setStep("social")} />
          </>
        )}

        {step === "social" && (
          <SocialLoginStep onGetStarted={() => setStep("email")} />
        )}

        {step === "email" && <EmailStep />}
      </DialogContent>
    </Dialog>
  );
}
