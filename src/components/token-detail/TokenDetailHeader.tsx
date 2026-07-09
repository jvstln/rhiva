import { Bot, Copy, Share2, Star, User } from "lucide-react";
import { HEADER_STATS } from "@/data/token-detail-data";
import { TokenThumbnail } from "@/features/market/components/TokenThumbnail";
import { cn } from "@/lib/utils";

export function TokenDetailHeader() {
  return (
    <div className="flex flex-wrap items-center gap-8 border-b border-border/70 px-6 py-4">
      <div className="flex items-center gap-3">
        <TokenThumbnail badge={undefined} className="size-11" />
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-b-1 font-bold text-white">TikTok</h1>
            <span className="text-b-4 text-gray">TikTok coin</span>
            <Star className="size-3.5 text-gray" />
            <Share2 className="size-3.5 text-gray" />
            <Bot className="size-4 text-primary" />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-b-5 text-gray">
            <span>18h</span>
            <span>AkSa...to5e</span>
            <User className="size-3" />
            <Copy className="size-3" />
          </div>
        </div>
      </div>

      <div className="text-h5 font-bold text-white">$194.23K</div>

      <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2">
        {HEADER_STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-b-5 text-gray">{stat.label}</p>
            <p
              className={cn(
                "text-b-2 font-semibold",
                stat.tone === "down" ? "text-down" : "text-white",
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
