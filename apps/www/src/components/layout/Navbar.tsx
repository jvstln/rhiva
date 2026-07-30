"use client";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Bell, Settings, Wallet, XIcon } from "lucide-react";
import { useLogin, usePrivy, useSigners } from "@privy-io/react-auth";

import { env } from "@/lib/env";
import { useAuth } from "@/hooks";
import logo from "@/public/logo.svg";
import { Skeleton } from "../ui/skeleton";
import { SearchInput } from "../ui/search-input";
import { cn, truncateString } from "@/lib/utils";
import { DiscordIcon, TelegramIcon } from "../ui/icons";
import { NotificationPopover } from "./NotificationPopover";
import { Button, buttonVariants } from "@/components/ui/button";
import { SettingsDialog } from "../../features/settings/components/SettingsDialog";
import { disconnectWalletDialogHandle } from "../../features/auth/components/DisconnectWalletDialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

const NAV_LINKS = [
  { label: "Market", url: "/market" },
  { label: "Liquidity", url: "/liquidity" },
  { label: "Reward", url: "/rewards" },
  { label: "Portfolio", url: "/portfolio" },
] as const satisfies Array<{ label: string; url: Route }>;

export function Navbar() {
  const auth = useAuth();
  const { ready } = usePrivy();
  const pathname = usePathname();
  const { addSigners } = useSigners();
  const { login } = useLogin({
    async onComplete({ user, isNewUser }) {
      if (isNewUser && user.wallet) {
        await addSigners({
          address: user.wallet.address,
          signers: [{ signerId: env.PRIVY_SIGNER_ID }],
        });
      }
    },
  });

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height,--spacing(16)) shrink-0 items-center gap-6 border-border border-b bg-background/95 px-6 backdrop-blur">
      <Link
        href="/"
        className="flex h-full shrink-0 items-center"
      >
        <Image
          src={logo}
          alt="Logo"
          className="h-2/3 w-auto"
        />
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          {NAV_LINKS.map((link) => (
            <NavigationMenuItem
              key={link.label}
              value={link.label}
            >
              <NavigationMenuLink
                render={<Link href={link.url} />}
                data-active={pathname.startsWith(link.url) ? true : undefined}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <li>
                  <NavigationMenuLink render={<Link href="#" />}>
                    Legal
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<Link href="#" />}>
                    Docs
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<Link href="#" />}>
                    Brand kit
                  </NavigationMenuLink>
                </li>
                <li className="flex gap-2">
                  <NavigationMenuLink
                    href="https://t.co"
                    target="_blank"
                  >
                    <TelegramIcon />
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href=""
                    target="_blank"
                  >
                    <DiscordIcon />
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href=""
                    target="_blank"
                  >
                    <XIcon />
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-auto flex items-center gap-3">
        <SearchInput />
        <NotificationPopover>
          <Button
            variant={"ghost"}
            size="icon"
          >
            <Bell />
          </Button>
        </NotificationPopover>
        <SettingsDialog>
          <Button
            variant={"ghost"}
            size="icon"
          >
            <Settings />
          </Button>
        </SettingsDialog>
        <Link
          href="/rewards"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "hidden border-primary sm:flex",
          )}
        >
          10K XP
        </Link>
        {ready ? (
          auth.authenticated ? (
            <Button
              variant="outline"
              onClick={() => disconnectWalletDialogHandle.open(null)}
              data-active
            >
              <Wallet />
              <span> {truncateString(auth.activeWallet.address)}</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => login({ walletChainType: "solana-only" })}
              data-active
            >
              Connect wallet
            </Button>
          )
        ) : (
          <Skeleton
            className={buttonVariants({
              variant: "outline",
              className: "min-w-26",
            })}
            data-active
          />
        )}
      </div>
    </header>
  );
}
