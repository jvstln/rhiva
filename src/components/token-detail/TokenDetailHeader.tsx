import { Bot, Copy, Share2, Star, User } from "lucide-react";
import React from "react";
import { HEADER_STATS } from "@/data/token-detail-data";
import { TokenThumbnail } from "@/features/market/components/TokenThumbnail";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export function TokenDetailHeader() {
  return (
    <div className="flex flex-wrap items-center gap-8 border-border/70 border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <TokenThumbnail badge={undefined} className="size-11" />
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-b-1 text-white">TikTok</h1>
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

      <div className="font-bold text-h5 text-white">$194.23K</div>

      <div className="flex flex-1 flex-wrap items-center gap-x-7 gap-y-2">
        {HEADER_STATS.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i !== 0 && <Separator orientation="vertical" />}
            <div>
              <p className="text-b-5 text-gray">{stat.label}</p>
              <p
                className={cn(
                  "font-semibold text-b-2",
                  stat.tone === "down" ? "text-down" : "text-white",
                )}
              >
                {stat.value}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
