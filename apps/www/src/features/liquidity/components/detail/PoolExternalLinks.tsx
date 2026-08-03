import type { ComponentType } from "react";

import type { LiquidityPool } from "@/features/liquidity/liquidity.type";
import { buttonVariants } from "@/components/ui/button";
import { SideRailSection } from "@/components/ui/side-rail";
import {
  AxiomIcon,
  BananaGunIcon,
  BirdeyeIcon,
  BonkbotIcon,
  FluxbotIcon,
  GeckoTerminalIcon,
  JupiterIcon,
  LpAgentIcon,
  MaestroIcon,
  PhotonIcon,
  TrojanIcon,
  type IconProps,
} from "@/components/ui/icons";

type ExternalLink = {
  name: string;
  href: string | ((pool: LiquidityPool) => string);
  icon: ComponentType<IconProps>;
};

const POOL_EXTERNAL_LINKS: ExternalLink[] = [
  { name: "LP Agent", icon: LpAgentIcon, href: "https://app.lpagent.io/" },
  {
    name: "Banana Gun",
    icon: BananaGunIcon,
    href: "https://t.me/bananagun_bot",
  },
  {
    name: "Jupiter",
    icon: JupiterIcon,
    href: (pool) => `https://jup.ag/tokens/${pool.token_mint_a}`,
  },
  { name: "Fluxbot", icon: FluxbotIcon, href: "https://t.me/fluxbeam_bot" },
  {
    name: "Trojan",
    icon: TrojanIcon,
    href: "https://t.me/solana_trojanbot",
  },
  { name: "BONKbot", icon: BonkbotIcon, href: "https://t.me/bonkbot_bot" },
  { name: "Maestro", icon: MaestroIcon, href: "https://t.me/maestro" },
  {
    name: "Photon",
    icon: PhotonIcon,
    href: (pool) =>
      `https://photon-sol.tinyastro.io/en/lp/${pool.pool_address}`,
  },
  { name: "Axiom", icon: AxiomIcon, href: "https://axiom.trade/" },
  {
    name: "Birdeye",
    icon: BirdeyeIcon,
    href: (pool) =>
      `https://birdeye.so/token/${pool.token_mint_a}?chain=solana`,
  },
  {
    name: "GeckoTerminal",
    icon: GeckoTerminalIcon,
    href: (pool) =>
      `https://www.geckoterminal.com/solana/pools/${pool.pool_address}`,
  },
];

export function PoolExternalLinks({ pool }: { pool: LiquidityPool }) {
  return (
    <SideRailSection title="External Links">
      <ul className="flex flex-wrap gap-1.5">
        {POOL_EXTERNAL_LINKS.map(({ name, href, icon: Icon }) => (
          <li key={name}>
            <a
              href={typeof href === "function" ? href(pool) : href}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Icon />
              {name}
            </a>
          </li>
        ))}
      </ul>
    </SideRailSection>
  );
}
