"use client";
import { Bell, ChevronDown, Copy, Search, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";

const NAV_LINKS = [
  { label: "Market", url: "/market" },
  { label: "Liquidity", url: "/liquidity" },
  { label: "Reward", url: "/reward" },
  { label: "Portfolio", url: "/portfolio" },
] as const;

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
      <nav className="flex items-center gap-4">
        <Link href="/">
          <Image src={logo} alt="Logo" className="h-5 w-fit" />
        </Link>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            className={cn(
              "text-b-2 font-medium transition-colors",
              pathname.startsWith(link.url)
                ? "text-white"
                : "text-grey hover:text-white/80",
            )}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          className="flex items-center gap-1 text-b-2 font-medium text-grey transition-colors hover:text-white/80"
        >
          More <ChevronDown className="size-4" />
        </button>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden w-72 lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey" />
          <Input
            placeholder="Search"
            className="h-10 border-border rounded-full bg-transparent pl-9"
          />
        </div>

        <IconButton icon={Bell} />
        <IconButton icon={Settings} />

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
            <Copy className="size-3.5 text-grey" />
          </button>
        ) : (
          <Button variant="soft">Connect wallet</Button>
        )}
      </div>
    </header>
  );
}

function IconButton({ icon: Icon }: { icon: typeof Bell }) {
  return (
    <button
      type="button"
      className="flex size-9 items-center justify-center rounded-md text-grey transition-colors hover:bg-secondary hover:text-white"
    >
      <Icon className="size-[18px]" />
    </button>
  );
}
