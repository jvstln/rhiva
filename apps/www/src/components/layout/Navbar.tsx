"use client";
import { Bell, Settings, XIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";
import { DiscordIcon, TelegramIcon } from "../ui/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { SearchInput } from "../ui/search-input";
import { connectWalletDialogHandle } from "../../features/auth/components/ConnectWalletDialog";
import { NotificationPopover } from "./NotificationPopover";
import { SettingsDialog } from "../../features/settings/components/SettingsDialog";
import { useAuth } from "@/features/auth/auth.hook";
import { Skeleton } from "../ui/skeleton";

const NAV_LINKS = [
  { label: "Market", url: "/market" },
  { label: "Liquidity", url: "/liquidity" },
  { label: "Reward", url: "/rewards" },
  { label: "Portfolio", url: "/portfolio" },
] as const satisfies Array<{ label: string; url: Route }>;

export function Navbar() {
  const pathname = usePathname();
  const { wallets, isPending } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height,--spacing(16)) shrink-0 items-center gap-6 border-border border-b bg-background/95 px-6 backdrop-blur">
      <Link href="/" className="flex h-full shrink-0 items-center">
        <Image src={logo} alt="Logo" className="h-2/3 w-auto" />
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          {NAV_LINKS.map((link) => (
            <NavigationMenuItem key={link.label} value={link.label}>
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
                  <NavigationMenuLink href="https://t.co" target="_blank">
                    <TelegramIcon />
                  </NavigationMenuLink>
                  <NavigationMenuLink href="" target="_blank">
                    <DiscordIcon />
                  </NavigationMenuLink>
                  <NavigationMenuLink href="" target="_blank">
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
          <Button variant={"ghost"} size="icon">
            <Bell />
          </Button>
        </NotificationPopover>
        <SettingsDialog>
          <Button variant={"ghost"} size="icon">
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
        {isPending ? (
          <Skeleton
            className={buttonVariants({
              variant: "outline",
              className: "min-w-26",
            })}
            data-active
          />
        ) : wallets.length === 0 ? (
          <Button
            variant="outline"
            onClick={() => connectWalletDialogHandle.open(null)}
            data-active
          >
            Connect wallet
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => connectWalletDialogHandle.open(null)}
            data-active
            tooltip={wallets[0].address}
          >
            {wallets[0].address.slice(0, 10)}...
          </Button>
        )}
      </div>
    </header>
  );
}
