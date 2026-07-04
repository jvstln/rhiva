import { AssistantBubble } from "@/components/assistant-bubble";
import { MarketColumn } from "@/components/market-column";
import { Navbar } from "@/components/navbar";
import { RadarSubnav } from "@/components/radar-sub-nav";
import {
  FRESH_TOKENS,
  GRADUATED_TOKENS,
  HEATING_TOKENS,
} from "@/lib/mock/market-data";

export function MarketPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar active="Market" />
      <RadarSubnav active="Radar" />

      <main className="flex flex-1">
        <MarketColumn title="Fresh" tokens={FRESH_TOKENS} />
        <MarketColumn title="Heating Up" tokens={HEATING_TOKENS} showMcToggle />
        <MarketColumn title="Graduated" tokens={GRADUATED_TOKENS} />
      </main>

      <AssistantBubble />
    </div>
  );
}
