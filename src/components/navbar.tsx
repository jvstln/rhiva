// "use client";
// import { Bell, ChevronDown, Copy, Search, Settings, XIcon } from "lucide-react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";

// // export function Navbar({
// //   active,
// //   walletConnected = false,
// //   walletAddress = "1Ffm...bpaZ",
// // }: NavbarProps) {
// //   return (
// //     <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-6 border-b border-border bg-background/95 px-6 backdrop-blur">
// //       <Logo />

// //       <nav className="flex items-center gap-6">
// //         {NAV_LINKS.map((link) => (
// //           <a
// //             key={link}
// //             href="#"
// //             className={cn(
// //               "text-b-2 font-medium transition-colors",
// //               link === active ? "text-white" : "text-grey hover:text-white/80",
// //             )}
// //           >
// //             {link}
// //           </a>
// //         ))}
// //         <button type="button" className="flex items-center gap-1 text-b-2 font-medium text-grey transition-colors hover:text-white/80">
// //           More <ChevronDown className="size-4" />
// //         </button>
// //       </nav>

// //       <div className="ml-auto flex items-center gap-3">
// //         <div className="relative hidden w-72 lg:block">
// //           <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey" />
// //           <Input
// //             placeholder="Search"
// //             className="h-10 border-border bg-transparent pl-9"
// //           />
// //         </div>

// //         <IconButton icon={Bell} />
// //         <IconButton icon={Settings} />

// //         <div className="hidden items-center rounded-md border border-primary/60 px-3 py-2 text-b-3 font-semibold text-white sm:flex">
// //           10K XP
// //         </div>

// import Image from "next/image";
// import Link from "next/link";
// import { constants } from "@/lib/constants";
// //         {walletConnected ? (
// //           <button type="button" className="flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-b-3 font-medium text-white">
// //             <span className="flex size-5 items-center justify-center rounded-sm bg-warning text-b-6 font-bold text-black">
// //               $
// //             </span>
// //             {walletAddress}
// //             <Copy className="size-3.5 text-grey" />
// //           </button>
// //         ) : (
// //           <Button className="rounded-md">Connect wallet</Button>
// //         )}
// //       </div>
// //     </header>
// //   );
// // }
// import logo from "@/public/logo.svg";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { DiscordIcon, TelegramIcon } from "./ui/icons";
// import { SearchInput } from "./ui/search-input";

// const NAV_LINKS = [
//   { label: "Market", active: true, url: "/market" },
//   { label: "Liquidity", url: "/liquidity" },
//   { label: "Reward", url: "/reward" },
//   { label: "Portfolio", url: "/portfolio" },
// ];

// export function Navbar() {
//   const [connected, setConnected] = useState(false); // Default to connected to show custom address state in mockup

//   return (
//     <header className="w-full h-[84px] bg-[#0A0A0A] border-b border-white/5 px-4 flex items-center justify-between">
//       {/* Left side: Logo & Navigation */}
//       <nav className="flex items-center gap-4 text-base font-inter">
//         <Image
//           src={logo}
//           alt={`${constants.APP_NAME} Logo`}
//           className="h-[21.49px] w-auto mr-4"
//         />
//         {NAV_LINKS.map((link) => (
//           <Link
//             key={link.label}
//             href={link.url}
//             className={`${
//               link.active
//                 ? "text-white font-semibold"
//                 : "text-white/50 hover:text-white/85 font-normal"
//             } transition-colors px-1 text-base leading-[19px]`}
//           >
//             {link.label}
//           </Link>
//         ))}
//         {/* Dropdown for More */}
//         <DropdownMenu>
//           <DropdownMenuTrigger className="flex items-center gap-1 text-white/50 hover:text-white/85 font-normal outline-none cursor-pointer text-base leading-[19px]">
//             <span>More</span>
//             <ChevronDown className="w-4 h-4 text-white/50" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="bg-[#0A0A0A] border border-white/10">
//             <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white">
//               Docs
//             </DropdownMenuItem>
//             <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-white">
//               Legal
//             </DropdownMenuItem>
//             <DropdownMenuItem className="hover:bg-white/10 cursor-pointer flex items-center justify-between gap-4 py-2 px-3">
//               <Link
//                 href="#"
//                 className="text-white/50 hover:text-white transition-colors"
//                 aria-label="Telegram"
//               >
//                 <TelegramIcon className="h-5 w-5" />
//               </Link>
//               <Link
//                 href="#"
//                 className="text-white/50 hover:text-white transition-colors"
//                 aria-label="Discord"
//               >
//                 <DiscordIcon className="h-5 w-5" />
//               </Link>
//               <Link
//                 href="#"
//                 className="text-white/50 hover:text-white transition-colors"
//                 aria-label="X"
//               >
//                 <XIcon className="h-5 w-5" />
//               </Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </nav>

//       {/* Right side: Search, Notifications, Settings, Wallet */}
//       <div className="flex items-center gap-4">
//         {/* Reusable Search Component matching Figma width of 297px */}
//         <SearchInput placeholder="Search" />

//         {/* Notifications & Settings */}
//         <div className="flex items-center gap-4 text-white/50">
//           <Button variant="ghost" size="icon" aria-label="Notifications">
//             <Bell />
//           </Button>
//           <Button variant="ghost" size="icon" aria-label="Settings">
//             <Settings />
//           </Button>
//         </div>

//         {/* Action Buttons: XP & Wallet */}
//         <div className="flex items-center gap-4">
//           <div className="hidden items-center rounded-md border border-primary/60 px-3 py-2 text-b-3 font-semibold text-white sm:flex">
//             10K XP
//           </div>
//           {connected ? (
//             <button
//               type="button"
//               onClick={() => setConnected(false)}
//               className="flex items-center justify-center px-4 py-[7px] h-[38px] w-[174px] bg-[#00d897]/10 hover:bg-[#00d897]/20 border border-[#00d897]/20 text-[#F3F3F3] backdrop-blur-[10px] rounded-[5px] font-roboto font-normal text-base tracking-[0.5px] transition-colors cursor-pointer"
//             >
//               1Ffm...bpaZ
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setConnected(true)}
//               className="flex items-center justify-center px-4 py-[7px] h-[38px] w-[174px] bg-[#002718] hover:bg-[#003823] border border-[#00d897]/20 text-white rounded-[5px] font-roboto font-medium text-base tracking-[0.5px] transition-colors cursor-pointer"
//             >
//               Connect wallet
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

import { Bell, ChevronDown, Copy, Search, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { constants } from "@/lib/constants";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";

const NAV_LINKS = [
  { label: "Market", href: "/market" },
  { label: "Liquidity", href: "/liquidity" },
  { label: "Reward", href: "/reward" },
  { label: "Portfolio", href: "/portfolio" },
] as const;

interface NavbarProps {
  active: "Market" | "Liquidity" | "Reward" | "Portfolio";
  walletConnected?: boolean;
  walletAddress?: string;
}

export function Navbar({
  active,
  walletConnected = false,
  walletAddress = "1Ffm...bpaZ",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-6 border-b border-border bg-background/95 px-6 backdrop-blur">
      <Image
        src={logo}
        alt={`${constants.APP_NAME} Logo`}
        className="h-[21.49px] w-auto mr-4"
      />

      <nav className="flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "text-b-2 font-medium transition-colors",
              link.label === active
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
            className="h-10 border-border bg-transparent pl-9"
          />
        </div>

        <IconButton icon={Bell} />
        <IconButton icon={Settings} />

        <div className="hidden items-center rounded-md border border-primary/60 px-3 py-2 text-b-3 font-semibold text-white sm:flex">
          10K XP
        </div>

        {walletConnected ? (
          <button className="flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-b-3 font-medium text-white">
            <span className="flex size-5 items-center justify-center rounded-sm bg-warning text-b-6 font-bold text-black">
              $
            </span>
            {walletAddress}
            <Copy className="size-3.5 text-grey" />
          </button>
        ) : (
          <Button className="rounded-md">Connect wallet</Button>
        )}
      </div>
    </header>
  );
}

function IconButton({ icon: Icon }: { icon: typeof Bell }) {
  return (
    <button className="flex size-9 items-center justify-center rounded-md text-grey transition-colors hover:bg-secondary hover:text-white">
      <Icon className="size-[18px]" />
    </button>
  );
}
