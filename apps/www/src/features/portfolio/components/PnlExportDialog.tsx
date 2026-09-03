"use client";

/* ------------------------------------------------------------------ */
/* Export Dialog                                                        */
/* ------------------------------------------------------------------ */

import { toast } from "sonner";
import { toBlob, toPng } from "html-to-image";
import { Download, PlusCircle, Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn, share } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { downloadLink, selectFile } from "@/lib/file.util";
import { PnlSummaryCard, TokenCard } from "./PnlCards";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatSignedUsd,
} from "@/lib/finance.util";
import type { PositionItem } from "../portfolio.type";
import { PNL_LOSS_IMAGES, PNL_PROFIT_IMAGES } from "../portfolio.schema";
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
  position?: PositionItem;
  token?: PositionItem;
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

  const currentToken = token ?? position;
  const tokenPnlUsd = currentToken
    ? (currentToken.pnl_usd ??
      currentToken.realized_usd + (currentToken.unrealized_usd ?? 0))
    : 0;
  const tokenInvestedUsd = currentToken
    ? (currentToken.invested_usd ??
      currentToken.bought * currentToken.avg_buy_usd)
    : 0;
  const tokenPnlPct =
    currentToken?.pnl_pct ??
    (tokenInvestedUsd > 0 ? (tokenPnlUsd / tokenInvestedUsd) * 100 : null);
  const isLoss =
    type === "summary" ? (summary?.value ?? 0) < 0 : tokenPnlUsd < 0;
  const allImages = isLoss ? PNL_LOSS_IMAGES : PNL_PROFIT_IMAGES;

  const [selectedBg, setSelectedBg] = useState(allImages[0]);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [_origin, setOrigin] = useState("");

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
        ];

  const uploadCustomBg = async () => {
    const file = await selectFile();
    if (!file) return;
    const firstFile = Array.isArray(file) ? file[0] : file;
    if (!firstFile) return;
    const url = URL.createObjectURL(firstFile);
    setCustomImages((prev) => [url, ...prev]);
    setSelectedBg(url);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      downloadLink(dataUrl, "pnl-card.png");
    } catch {
      toast.error("Failed to export image");
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await toBlob(cardRef.current, { cacheBust: true });
      if (!blob) return;
      const file = new File([blob], "pnl-card.png", { type: "image/png" });
      await share({
        files: [file],
        title: "PnL Card",
        url: window.location.href,
      });
    } catch {
      toast.error("Failed to share image");
    }
  };

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>PnL Card</DialogTitle>
          <DialogDescription className="sr-only">
            Generate and export a shareable PnL card image
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Card Preview */}
          <div className="overflow-hidden rounded-xl border border-border">
            {type === "summary" && summary ? (
              <PnlSummaryCard
                ref={cardRef}
                image={selectedBg}
                timeframe={timeframe ?? "1d"}
                value={formatSignedUsd(summary.value)}
                realized={formatSignedUsd(summary.realized)}
                unrealized={formatSignedUsd(summary.unrealized)}
                biggestWin="—"
                winRate="—"
              />
            ) : (
              <TokenCard
                ref={cardRef}
                image={selectedBg}
                pnl={
                  hideProfit
                    ? "******"
                    : `${formatCompactNumber(tokenPnlPct, { withSign: true })}%`
                }
                invested={
                  hideBalance
                    ? "******"
                    : formatCompactCurrency(tokenInvestedUsd)
                }
                value={hideProfit ? "******" : formatSignedUsd(tokenPnlUsd)}
                tokenName={
                  currentToken?.symbol ?? currentToken?.mint ?? "Token"
                }
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
                        alt="Background option"
                        className="size-full object-cover"
                      />
                    </picture>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={uploadCustomBg}
                  className="flex aspect-video h-auto w-24 flex-col items-center justify-center gap-1 rounded-md border border-border text-muted-foreground text-xs hover:text-foreground"
                >
                  <PlusCircle className="size-5" />
                  Custom
                </Button>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Toggles */}
          {toggles.length > 0 && (
            <div className="flex flex-wrap gap-4 border-border border-t pt-3">
              {toggles.map((toggle) => (
                <Field
                  key={toggle.label}
                  orientation="horizontal"
                >
                  <Switch
                    id={toggle.label}
                    checked={toggle.value}
                    onCheckedChange={toggle.onChange}
                  />
                  <FieldLabel htmlFor={toggle.label}>{toggle.label}</FieldLabel>
                </Field>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            className="w-full flex-1"
            onClick={handleShare}
          >
            <Share />
            Share
          </Button>
          <Button
            className="w-full flex-1"
            onClick={handleDownload}
          >
            <Download />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { PnlExportDialog };
