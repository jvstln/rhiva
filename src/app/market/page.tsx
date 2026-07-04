import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { Navbar } from "@/components/layout/Navbar";
import { MarketColumn } from "@/components/market/MarketColumn";
import { RadarSubnav } from "@/components/market/RadarSubnav";
import {
  FRESH_TOKENS,
  GRADUATED_TOKENS,
  HEATING_TOKENS,
} from "@/data/market-data";

export default function MarketPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
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
