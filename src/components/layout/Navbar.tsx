"use client";
import { Bell, Copy, Settings, XIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import { NotificationPopover } from "./NotificationPopover";
import { SettingsDialog } from "./SettingsDialog";

const NAV_LINKS = [
  { label: "Market", url: "/market" },
  { label: "Liquidity", url: "/liquidity" },
  { label: "Reward", url: "/rewards" },
  { label: "Portfolio", url: "/portfolio" },
] as const satisfies Array<{ label: string; url: Route }>;

interface NavbarProps {
  walletConnected?: boolean;
  walletAddress?: string;
}

export function Navbar({
  walletConnected = false,
  walletAddress = "1Ffm...bpaZ",
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-6 border-b border-border bg-background/95 px-6 backdrop-blur">
      <Link href="/" className="block size-fit shrink-0">
        <Image src={logo} alt="Logo" className="h-5 w-fit" />
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

        <Badge variant="outline" className="hidden sm:flex">
          10K XP
        </Badge>

        {walletConnected ? (
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-b-3 font-medium text-white"
          >
            <span className="flex size-5 items-center justify-center rounded-sm bg-warning text-b-6 font-bold text-black">
              $
            </span>
            {walletAddress}
            <Copy className="size-3.5 text-gray" />
          </button>
        ) : (
          <ConnectWalletDialog>
            <Button variant="soft">Connect wallet</Button>
          </ConnectWalletDialog>
        )}
      </div>
    </header>
  );
}
