"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useCreateWallet } from "@privy-io/react-auth/solana";
import { useLogin, usePrivy, useSigners } from "@privy-io/react-auth";
import { Bell, MenuIcon, Search, Settings, Wallet, XIcon } from "lucide-react";

import { env } from "@/lib/env";
import { useAuth, useBreakpoint } from "@/hooks";
import logo from "@/public/logo.svg";
import RewardButton from "./RewardButton";
import { Skeleton } from "../ui/skeleton";
import { truncateString } from "@/lib/utils";
import { DiscordIcon, TelegramIcon } from "../ui/icons";
import { NotificationPopover } from "./NotificationPopover";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserMenuPopover } from "@/features/auth/components/UserMenuPopover";
import { SearchTokenDialog } from "@/features/market/components/search-token-dialog";
import { SettingsDialog } from "../../features/settings/components/SettingsDialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "../ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const NAV_LINKS = [
  { label: "Market", url: "/market" },
  { label: "Radar", url: "/radar" },
  { label: "Reward", url: "/rewards" },
  { label: "Portfolio", url: "/portfolio" },
] as const satisfies Array<{ label: string; url: Route }>;

const MORE_LINKS = [
  { label: "Legal", url: "#" },
  { label: "Docs", url: "#" },
  { label: "Brand kit", url: "#" },
] as const satisfies Array<{ label: string; url: Route }>;

export function Navbar() {
  const auth = useAuth();
  const pathname = usePathname();
  const lgUp = useBreakpoint("lg");
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
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-border border-b bg-background/95 px-3 backdrop-blur lg:gap-6 lg:px-6">
      <div className="flex items-center gap-1 lg:contents">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="lg:hidden"
              />
            }
          >
            <MenuIcon />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-60 gap-4 lg:hidden"
          >
            <nav
              aria-label="Main navigation"
              className="flex flex-col items-start gap-1"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.url}
                  data-active={pathname.startsWith(link.url) ? true : undefined}
                  className="w-full rounded-lg px-3 py-2 font-medium text-base transition-colors hover:bg-muted data-active:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex w-full flex-col items-start gap-1 border-white/5 border-t pt-3">
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.url}
                  className="w-full rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Link
          href="/"
          className="flex h-full shrink-0 items-center"
        >
          <Image
            src={logo}
            alt="Logo"
            className="h-8 w-auto lg:h-2/3"
          />
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="max-lg:hidden">
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

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        <SearchTokenDialog>
          <Button
            variant={lgUp ? "outline" : "ghost"}
            size={lgUp ? "default" : "icon-sm"}
            className={lgUp ? "min-w-40 justify-start" : ""}
            aria-label="Search tokens"
          >
            <Search />
            {lgUp && <span>Search</span>}
          </Button>
        </SearchTokenDialog>
        <NotificationPopover>
          <Button
            variant={"ghost"}
            size="icon"
            aria-label="Notifications"
          >
            <Bell />
          </Button>
        </NotificationPopover>
        <SettingsDialog>
          <Button
            variant={"ghost"}
            size="icon"
            aria-label="Settings"
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
                <span className="max-lg:hidden">
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
