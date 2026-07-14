"use client";

import { toPng } from "html-to-image";
import { Download, PlusCircle, Share } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import type { LpPosition } from "@/data/portfolio-data";
import { downloadLink, selectFile } from "@/lib/file.util";
import { cn } from "@/lib/utils";
import {
  PNL_LOSS_IMAGES,
  PNL_PROFIT_IMAGES,
  PortfolioTab,
} from "../portfolio.schema";
import { LpCard, TokenCard } from "./PnlCards";

/* ------------------------------------------------------------------ */
/* Export Dialog                                                        */
/* ------------------------------------------------------------------ */

interface PnlExportDialogProps extends Dialog.Props {
  children?: React.ReactElement;
  position?: LpPosition;
}

const PnlExportDialog = ({
  children,
  position,
  ...props
}: PnlExportDialogProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hideProfit, setHideProfit] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [hideTime, setHideTime] = useState(false);

  const searchParams = useSearchParams();
  const activeView = PortfolioTab.catch("liquidityPosition").parse(
    searchParams.get("view"),
  );

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
  const [customImages, setCustomImages] = useState<string[]>([]);

  const toggles = [
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

      <DialogContent className="flex flex-col sm:max-w-xl">
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
              <Field key={label} className="w-fit">
                <FieldLabel>
                  <Switch checked={value} onCheckedChange={onChange} />
                  {label}
                </FieldLabel>
              </Field>
            ))}
          </div>

          {/* LP Card Preview */}
          <div className="h-full min-h-0 grow">
            {activeView === "liquidityPosition" ? (
              <LpCard
                ref={cardRef}
                image={selectedBg}
                pnl={"+16.60%"}
                tvl={"$1.62"}
                value={"$0.49"}
                poolName="ANSEM-SOL"
                timeAgo="-494,707,087:59:55"
              />
            ) : (
              <TokenCard
                ref={cardRef}
                image={selectedBg}
                pnl={"+16.60%"}
                invested="0.1 SOL"
                value={"$0.49"}
                tokenName="Trump"
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

const PnlExportDialogWithSuspense = () => (
  <Suspense>
    <PnlExportDialog />
  </Suspense>
);

export { PnlExportDialogWithSuspense as PnlExportDialog };
