import {
  FRESH_TOKENS,
  GRADUATED_TOKENS,
  HEATING_TOKENS,
} from "@/data/market-data";
import { MarketColumn } from "./MarketColumn";

export const RadarView = () => {
  return (
    <div className="flex flex-1">
      <MarketColumn title="Fresh" tokens={FRESH_TOKENS} />
      <MarketColumn title="Heating Up" tokens={HEATING_TOKENS} showMcToggle />
      <MarketColumn title="Graduated" tokens={GRADUATED_TOKENS} />
    </div>
  );
};
