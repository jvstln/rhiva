"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useCreateWallet } from "@privy-io/react-auth/solana";
import { useLogin, usePrivy, useSigners } from "@privy-io/react-auth";
import { Bell, MenuIcon, Settings, Wallet, XIcon } from "lucide-react";

import { env } from "@/lib/env";
import { useAuth } from "@/hooks";
import logo from "@/public/logo.svg";
import RewardButton from "./RewardButton";
import { Skeleton } from "../ui/skeleton";
import { truncateString } from "@/lib/utils";
import { SearchInput } from "../ui/search-input";
import { DiscordIcon, TelegramIcon } from "../ui/icons";
import { NotificationPopover } from "./NotificationPopover";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserMenuPopover } from "@/features/auth/components/UserMenuPopover";
import { SettingsDialog } from "../../features/settings/components/SettingsDialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "../ui/navigation-menu";

const NAV_LINKS = [
  { label: "Market", url: "/market" },
  { label: "Liquidity", url: "/liquidity" },
  { label: "Reward", url: "/rewards" },
  { label: "Portfolio", url: "/portfolio" },
] as const satisfies Array<{ label: string; url: Route }>;

export function Navbar() {
  const auth = useAuth();
  const pathname = usePathname();
  const { user, ready } = usePrivy();
  const { addSigners } = useSigners();
  const { createWallet } = useCreateWallet();

  const { login } = useLogin({
    async onComplete({ user, isNewUser }) {
      if (user.wallet) {
        if (isNewUser) {
          await addSigners({
            address: user.wallet.address,
            signers: [{ signerId: env.privySignerId }],
          });
        }
      } else createWallet({ signers: [{ signerId: env.privyAppId }] });
    },
  });

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-6 border-border border-b bg-background/95 pr-4 backdrop-blur sm:px-6">
      <div className="flex items-center sm:contents">
        <Button
          variant="ghost"
          className="sm:hidden"
        >
          <MenuIcon />
        </Button>
        <Link
          href="/"
          className="flex h-full shrink-0 items-center"
        >
          <Image
            src={logo}
            alt="Logo"
            className="h-8 w-auto sm:h-2/3"
          />
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="max-sm:hidden">
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
        {auth.authenticated && <RewardButton />}
        {ready ? (
          auth.authenticated ? (
            <UserMenuPopover
              user={user!}
              activeWallet={auth.activeWallet}
            >
              <Button
                variant="outline"
                data-active
              >
                <Wallet />
                <span className="max-sm:hidden">
                  &nbsp;
                  {truncateString(auth.activeWallet.address)}
                </span>
              </Button>
            </UserMenuPopover>
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
