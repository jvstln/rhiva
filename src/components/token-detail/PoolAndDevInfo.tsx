import { Copy, ExternalLink, Lock, Search } from "lucide-react";

import { InfoRow, InfoSection } from "./InfoSection";

export function DynamicPoolInfoCard() {
  return (
    <InfoSection title="Dynamic BC Pool Info">
      <InfoRow
        label="Total liq"
        value={
          <span className="flex items-center gap-1 font-medium">
            $3.91K(22.82 SOL) <Lock className="size-3 text-grey" />
          </span>
        }
      />
      <div className="mt-2 grid grid-cols-3 gap-2 text-b-5 text-grey">
        <span>Pair</span>
        <span>Liq/Initial</span>
        <span className="text-right">Value</span>
      </div>
      <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
        <span className="text-white">TikTok</span>
        <span className="text-white">12.6M/12.9M(1.29%)</span>
        <span className="text-right text-white">$2.44K</span>
      </div>
      <div className="grid grid-cols-3 gap-2 py-0.5 text-b-4">
        <span className="text-white">SOL</span>
        <span className="text-up">22.82/22(+3.7%)</span>
        <span className="text-right text-white">$1.94K</span>
      </div>
    </InfoSection>
  );
}

export function DevInfoCard() {
  return (
    <InfoSection title="DEV Info">
      <InfoRow
        label="DEV"
        value={
          <span className="flex items-center gap-1 font-medium">
            E7KH...bzzN(113.82 SOL)
            <Copy className="size-3 text-grey" />
            <Search className="size-3 text-grey" />
          </span>
        }
      />
      <InfoRow
        label="Funding"
        value={
          <span className="flex items-center gap-1 font-medium">
            <ExternalLink className="size-3 text-grey" /> HXdq...rLRa 127.78 8d
          </span>
        }
      />
    </InfoSection>
  );
}

export function BasicDataCard() {
  return (
    <InfoSection title="Basic Data">
      <InfoRow label="Market cap" value="$194.23K" />
      <InfoRow label="Holders" value="40" />
      <InfoRow label="Total supply" value="1B" />
      <InfoRow
        label="Pair"
        value={
          <span className="flex items-center gap-1">
            D6BG...QZ2g <Copy className="size-3 text-grey" />
          </span>
        }
      />
      <InfoRow label="Token created" value="05/25/2026 20:40:27" />
      <InfoRow label="Pool created" value="05/25/2026 20:40:27" />
    </InfoSection>
  );
}
