"use client";

import { ArrowUpRight, ChevronLeft, Mail, Waves } from "lucide-react";
import Image from "next/image";
import type * as React from "react";
import { useState } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siApple,
  siCoinbase,
  siEthereum,
  siGoogle,
  siOkx,
  siWalletconnect,
  siX,
} from "simple-icons";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import solflare from "@/public/brands/solflare.png";
import { Item, ItemFooter, ItemMedia } from "../ui/item";

/* ------------------------------------------------------------------ */
/* Shared icon helpers                                                  */
/* ------------------------------------------------------------------ */

function BrandIcon({
  icon,
  className,
  color,
}: {
  icon: SimpleIcon;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill={color ?? `#${icon.hex}`}
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}

/** Placeholder for wallet brands not available in simple-icons. */
function FallbackGlyph({
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
  bgClassName: string;
  icon: React.ReactNode;
  onSelect?: () => void;
}

function WalletTile({ entry }: { entry: WalletEntry }) {
  return (
    <button
      type="button"
      onClick={entry.onSelect}
      className="flex w-24 flex-col items-center gap-2 text-center"
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-2xl border border-border [&_svg]:size-8",
          entry.bgClassName,
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

function WalletTileCompact({ entry }: { entry: WalletEntry }) {
  return (
    <button
      type="button"
      onClick={entry.onSelect}
      className={cn(
        "flex size-12 items-center justify-center rounded-xl border border-border [&_svg]:size-6",
        entry.bgClassName,
      )}
    >
      {entry.icon}
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
      bgClassName: "bg-[#0B1728]",
      icon: <FallbackGlyph label="J" className="text-ocean-green" />,
    },
  ];

  const topWallet: WalletEntry[] = [
    {
      id: "jupiter",
      name: "Jupiter",
      bgClassName: "bg-[#0B1728]",
      icon: <FallbackGlyph label="J" className="text-ocean-green" />,
    },
    {
      id: "phantom",
      name: "Phantom",
      bgClassName: "bg-[#AB9FF2]",
      icon: <FallbackGlyph label="P" className="text-white" />,
    },
    {
      id: "backpack",
      name: "Backpack",
      bgClassName: "bg-black",
      icon: <FallbackGlyph label="B" className="text-roman" />,
    },
    {
      id: "coinbase",
      name: "Coinbase",
      bgClassName: "bg-[#0052FF]",
      icon: <BrandIcon icon={siCoinbase} color="#ffffff" />,
    },
    {
      id: "okx",
      name: "OKX Wallet",
      bgClassName: "bg-black",
      icon: <BrandIcon icon={siOkx} color="#ffffff" />,
    },
  ];

  const reownWalletConnect: WalletEntry[] = [
    {
      id: "wallet-connect",
      name: "Wallet Connect",
      bgClassName: "bg-surface-2",
      icon: <BrandIcon icon={siWalletconnect} />,
    },
  ];

  const moreWallets: WalletEntry[] = [
    {
      id: "metamask-1",
      bgClassName: "bg-white",
      icon: <FallbackGlyph label="🦊" />,
    },
    {
      id: "ethereum-1",
      bgClassName: "bg-white",
      icon: <BrandIcon icon={siEthereum} color="#0b0b0b" />,
    },
    {
      id: "arrows-1",
      bgClassName: "bg-gradient-to-br from-dodger-blue to-ocean-green",
      icon: <FallbackGlyph label="⇄" className="text-black" />,
    },
    {
      id: "tiplink",
      bgClassName: "bg-[#0B1728]",
      icon: <FallbackGlyph label="TL" className="text-dodger-blue text-xs" />,
    },
    {
      id: "magic-eden",
      bgClassName: "bg-gradient-to-br from-casablanca to-roman",
      icon: <FallbackGlyph label="ME" className="text-black text-xs" />,
    },
    {
      id: "arrows-2",
      bgClassName: "bg-gradient-to-br from-dodger-blue to-ocean-green",
      icon: <FallbackGlyph label="⇄" className="text-black" />,
    },
    {
      id: "metamask-2",
      bgClassName: "bg-white",
      icon: <FallbackGlyph label="🦊" />,
    },
    {
      id: "ethereum-2",
      bgClassName: "bg-white",
      icon: <BrandIcon icon={siEthereum} color="#0b0b0b" />,
    },
  ];

  return (
    <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
      <WalletSection title="Recently Used">
        <button type="button" onClick={onSelectSocials}>
          <Item variant={"outline"}>
            <ItemMedia variant={"image"}>
              <Image src={solflare} alt="Solflare icon" />
            </ItemMedia>
            <ItemFooter>Solflare</ItemFooter>
          </Item>
        </button>
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
        <button type="button" onClick={onSelectSocials}>
          <Item variant={"outline"}>
            <ItemMedia className="">
              <BrandIcon icon={siGoogle} className="size-4" />
              <BrandIcon icon={siX} color="#ffffff" className="size-4" />
              <BrandIcon icon={siApple} color="#ffffff" className="size-4" />
            </ItemMedia>
            <ItemFooter>Socials</ItemFooter>
          </Item>
        </button>
        {reownWalletConnect.map((entry) => (
          <WalletTile key={entry.id} entry={entry} />
        ))}
      </WalletSection>

      <div className="space-y-3">
        <p className="font-medium text-foreground text-sm">More Wallets</p>
        <div className="flex flex-wrap gap-3">
          {moreWallets.map((entry) => (
            <WalletTileCompact key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
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
      <BrandIcon icon={siGoogle} className="size-5" />
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
          <BrandIcon icon={siX} color="#ffffff" className="size-4" />
        </span>
      </button>
      <button
        type="button"
        className="flex items-center justify-center rounded-xl bg-surface-2 py-4 transition-colors hover:bg-surface-3"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-black">
          <BrandIcon icon={siApple} color="#ffffff" className="size-4" />
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
      <DialogContent
        className={cn("gap-0 border-border bg-background sm:max-w-[420px]")}
      >
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
