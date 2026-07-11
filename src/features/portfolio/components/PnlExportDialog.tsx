"use client";

import { toPng } from "html-to-image";
import { Download, Share } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { LpPosition } from "@/data/portfolio-data";
import { downloadLink } from "@/lib/file.util";
import { cn } from "@/lib/utils";
import { PNL_LOSS_IMAGES, PNL_PROFIT_IMAGES } from "../portfolio.schema";

/* ------------------------------------------------------------------ */
/* LP Card — background image with overlaid text                        */
/* ------------------------------------------------------------------ */

interface LpCardProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  position: LpPosition;
  backgroundImage: string;
  hideProfit: boolean;
  hideBalance: boolean;
  hideTime: boolean;
}

function LpCard({
  ref,
  position,
  backgroundImage,
  hideProfit,
  hideBalance,
  hideTime,
}: LpCardProps) {
  const _isProfit = position.pnlPct.startsWith("+");

  return (
    <div ref={ref} className="@container relative h-full min-w-0">
      <picture>
        <img
          src={backgroundImage}
          alt={"LP card"}
          className="size-auto max-h-full max-w-full"
        />
      </picture>

      <div
        className="absolute inset-y-0 right-0 z-10 flex flex-col p-5 text-right"
        style={{ background: "linear-gradient(to left, #000, transparent)" }}
      >
        <div className="text-[7cqh] tracking-widest">TRUMP</div>
        <div className="mb-[12cqh] font-extrabold text-[13cqh] text-up leading-[0.75]">
          -$23.49
        </div>
        <div className="flex justify-end gap-6">
          <div className="">
            <div className="text-[4cqh] text-muted-foreground uppercase">
              PNL
            </div>
            <div className="font-semibold text-[5cqh]">-10.34%</div>
          </div>
          <div className="">
            <div className="text-[4cqh] text-muted-foreground uppercase">
              INVESTED
            </div>
            <div className="font-semibold text-[5cqh]">0.1 SOL</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Export Dialog                                                        */
/* ------------------------------------------------------------------ */

interface PnlExportDialogProps extends Dialog.Props {
  children?: React.ReactElement;
  position?: LpPosition;
}

export const PnlExportDialog = ({
  children,
  position,
  ...props
}: PnlExportDialogProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hideProfit, setHideProfit] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [hideTime, setHideTime] = useState(false);

  const mockPosition: LpPosition = position ?? {
    pool: "ANSEM-SOL",
    timeAgo: "-494,707,087:59:55",
    pnlUsd: "+$0.08",
    pnlPct: "+16.60%",
    totalDeposit: "$0.49",
    totalWithdraw: "$1.46",
    totalFeesEarned: "$0.05",
  };

  const isProfit = mockPosition.pnlPct.startsWith("+");
  const allImages = isProfit ? PNL_PROFIT_IMAGES : PNL_LOSS_IMAGES;

  const [selectedBg, setSelectedBg] = useState(allImages[0]);

  const _toggles = [
    { label: "Hide Profit", value: hideProfit, onChange: setHideProfit },
    { label: "Hide Balance", value: hideBalance, onChange: setHideBalance },
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

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}

      <DialogContent className="flex size-full flex-col sm:max-w-auto">
        <DialogHeader>
          <DialogTitle>Share position performance</DialogTitle>
          <DialogDescription>
            Customize and export your LP position card.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 grow flex-col gap-4">
          {/* Toggles */}
          {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {toggles.map(({ label, value, onChange }) => (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-1.5"
              >
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  className="scale-75"
                />
                <span className="text-muted-foreground text-sm">{label}</span>
              </label>
            ))}
          </div> */}

          {/* LP Card Preview */}
          <div className="h-full min-h-0 grow">
            <LpCard
              ref={cardRef}
              position={mockPosition}
              backgroundImage={selectedBg}
              hideProfit={hideProfit}
              hideBalance={hideBalance}
              hideTime={hideTime}
            />
          </div>

          {/* Background gallery */}
          <div>
            <p className="mb-1 font-medium text-foreground text-sm">
              Selected preferred background
            </p>
            <p className="mb-3 text-muted-foreground text-xs">
              Choose a background from gallery
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedBg(img)}
                  className={cn(
                    "relative aspect-video w-24 overflow-hidden rounded-lg border-2 transition-all",
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
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDownload}>
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
