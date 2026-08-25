"use client";

/* ------------------------------------------------------------------ */
/* Export Dialog                                                        */
/* ------------------------------------------------------------------ */

import { toast } from "sonner";
import { toBlob, toPng } from "html-to-image";
import { useSearchParams } from "next/navigation";
import { Download, PlusCircle, Share } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

import { cn, share } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { downloadLink, selectFile } from "@/lib/file.util";
import { LpCard, PnlSummaryCard, TokenCard } from "./PnlCards";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedUsd,
} from "@/lib/finance.util";
import type { LpPosition, TokenPosition } from "@rhivadotfun/dataapi";
import {
  PNL_LOSS_IMAGES,
  PNL_PROFIT_IMAGES,
  PortfolioTab,
} from "../portfolio.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PnlExportDialogProps extends Dialog.Props {
  children?: React.ReactElement;
  position?: LpPosition;
  token?: TokenPosition;
  type?: "summary";
  timeframe?: string;
  summary?: {
    value: number;
    realized: number;
    unrealized: number;
  };
}

const PnlExportDialog = ({
  children,
  type,
  position,
  token,
  timeframe,
  summary,
  ...props
}: PnlExportDialogProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hideProfit, setHideProfit] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [hideTime, setHideTime] = useState(false);

  const searchParams = useSearchParams();
  const activeView = PortfolioTab.catch("tradingPosition").parse(
    searchParams.get("view"),
  );

  const lpPnlUsd = position
    ? (position.current_value_usd ?? 0) - position.net_amount
    : 0;
  const lpPnlPct =
    position && position.net_amount > 0
      ? (lpPnlUsd / position.net_amount) * 100
      : null;
  const tokenPnlUsd = token
    ? token.realized_pnl_usd + (token.unrealized_pnl_usd ?? 0)
    : 0;
  const tokenInvestedUsd = token ? token.bought * token.avg_buy_price_usd : 0;
  const tokenPnlPct =
    tokenInvestedUsd > 0 ? (tokenPnlUsd / tokenInvestedUsd) * 100 : null;
  const isLoss =
    type === "summary"
      ? (summary?.value ?? 0) < 0
      : activeView === "tradingPosition"
        ? tokenPnlUsd < 0
        : lpPnlUsd < 0;
  const allImages = isLoss ? PNL_LOSS_IMAGES : PNL_PROFIT_IMAGES;

  const [selectedBg, setSelectedBg] = useState(allImages[0]);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setSelectedBg(isLoss ? PNL_LOSS_IMAGES[0] : PNL_PROFIT_IMAGES[0]);
  }, [isLoss]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const toggles =
    type === "summary"
      ? []
      : [
          { label: "Hide Profit", value: hideProfit, onChange: setHideProfit },
          {
            label: "Hide Balance",
            value: hideBalance,
            onChange: setHideBalance,
          },
          { label: "Hide Time", value: hideTime, onChange: setHideTime },
        ];

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current);
      downloadLink(dataUrl, "pnl-card.png");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate PNL card");
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const blob = await toBlob(cardRef.current);
      if (!blob) throw new Error("Failed to generate image to share");

      const files = [new File([blob], "pnl-card.png", { type: "image/png" })];

      await share({
        title: "Share PnL",
        text: `Check out my PnL on Rhiva! ${origin}`,
        files,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to share PNL card");
    }
  };

  // Cleanup custom images on unmount
  useEffect(
    () => () => {
      customImages.forEach((image) => {
        URL.revokeObjectURL(image);
      });
    },
    [customImages],
  );

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}

      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Share position performance</DialogTitle>
          <DialogDescription>
            Customize and export your LP position card.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 grow flex-col gap-4">
          {/* Toggles */}
          <div className="flex items-center gap-x-4 gap-y-2">
            {toggles.map(({ label, value, onChange }) => (
              <Field
                key={label}
                className="w-fit"
              >
                <FieldLabel>
                  <Switch
                    checked={value}
                    onCheckedChange={onChange}
                  />
                  {label}
                </FieldLabel>
              </Field>
            ))}
          </div>

          {/* LP Card Preview */}
          <div className="h-full min-h-0 grow">
            {type === "summary" ? (
              // TODO: biggest win and win rate are not exposed by the token portfolio API yet
              <PnlSummaryCard
                ref={cardRef}
                image={selectedBg}
                value={summary ? formatSignedUsd(summary.value) : "-"}
                realized={summary ? formatSignedUsd(summary.realized) : "-"}
                unrealized={summary ? formatSignedUsd(summary.unrealized) : "-"}
                biggestWin="-"
                winRate="-"
                timeframe={timeframe ?? "30d"}
              />
            ) : activeView === "tradingPosition" ? (
              <TokenCard
                ref={cardRef}
                image={selectedBg}
                pnl={`${formatCompactNumber(tokenPnlPct, { withSign: true })}%`}
                invested={formatCompactCurrency(tokenInvestedUsd)}
                value={formatSignedUsd(tokenPnlUsd)}
                tokenName={token?.symbol ?? token?.mint ?? "Token"}
              />
            ) : (
              <LpCard
                ref={cardRef}
                image={selectedBg}
                pnl={`${formatCompactNumber(lpPnlPct, { withSign: true })}%`}
                tvl={formatCompactCurrency(position?.current_value_usd)}
                value={formatSignedUsd(lpPnlUsd)}
                poolName={position?.symbol ?? "LP Position"}
                timeAgo="—"
              />
            )}
          </div>

          {/* Background gallery */}
          <div>
            <p className="mb-1 font-medium text-foreground text-sm">
              Selected preferred background
            </p>
            <p className="mb-3 text-muted-foreground text-xs">
              Choose a background from gallery
            </p>
            <ScrollArea>
              <div className="flex gap-2 pb-1">
                {[...allImages, ...customImages].map((img) => (
                  <Button
                    key={img}
                    onClick={() => setSelectedBg(img)}
                    className={cn(
                      "aspect-video h-auto w-24 overflow-hidden rounded-md border-2 p-0",
                      selectedBg === img
                        ? "border-primary ring-1 ring-primary"
                        : "border-border hover:border-border/80",
                    )}
                  >
                    <picture>
                      <img
                        src={img}
                        alt="background option"
                        className="h-full w-full object-cover"
                      />
                    </picture>
                  </Button>
                ))}
                <Button
                  variant={"ghost"}
                  className={cn(
                    "aspect-video h-auto w-24 flex-col overflow-hidden rounded-md border-2 border-border p-0 text-xs",
                  )}
                  onClick={async () => {
                    try {
                      const files = await selectFile({ accept: "image/*" });
                      if (files && files.length > 0) {
                        const file = files[0];
                        const url = URL.createObjectURL(file);
                        setCustomImages((prev) => [...prev, url]);
                        setSelectedBg(url);
                      }
                    } catch (err) {
                      console.error("Error selecting file:", err);
                      toast.error("Failed to select custom image");
                    }
                  }}
                >
                  <PlusCircle />
                  Custom image
                </Button>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleShare}
          >
            <Share />
            Share
          </Button>
          <Button onClick={handleDownload}>
            <Download />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PnlExportDialogWithSuspense = (props: PnlExportDialogProps) => (
  <Suspense>
    <PnlExportDialog {...props} />
  </Suspense>
);

export { PnlExportDialogWithSuspense as PnlExportDialog };
