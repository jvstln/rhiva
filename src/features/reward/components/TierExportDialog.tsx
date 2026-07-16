"use client";
import { toBlob, toPng } from "html-to-image";
import { Download, Globe, Share } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import type { RewardTier } from "@/data/reward-data";
import { downloadLink } from "@/lib/file.util";
import { share } from "@/lib/utils";

type TierShareDialogProps = Dialog.Props & {
  tier: RewardTier;
  children: React.ReactElement;
};

export const TierExportDialog = ({
  tier,
  children,
  ...props
}: TierShareDialogProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current);

      downloadLink(dataUrl, "tier.png");
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

      const files = [new File([blob], "tier.png", { type: "image/png" })];

      await share({
        title: "Share Tier",
        text: `I've just reached the ${tier.name} tier on Rhiva with ${tier.minXp.toLocaleString()} XP! Rank: #100. Join the leaderboard! ${origin}`,
        files,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate PNL card");
    }
  };

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}

      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Share your current tier</DialogTitle>
          <DialogDescription>
            Let your friends know your current progress
          </DialogDescription>
        </DialogHeader>

        <div
          ref={cardRef}
          className="relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-lg bg-surface-1 p-6 text-center"
          style={{
            boxShadow: `inset 1px 1px 0 rgba(255, 255, 255, 0.6)`,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-0 left-1/2 size-32 rounded-full bg-foreground/30 blur-[100px]" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 font-medium text-xl">
              Current Point:{" "}
              <div className="font-extrabold text-3xl text-primary">
                1000{tier.minXp.toLocaleString()} XP
              </div>
            </div>
            <div className="flex items-center gap-2 font-medium text-lg text-muted-foreground">
              Rank:{" "}
              <div className="font-bold text-foreground text-xl">#{100}</div>
            </div>
          </div>

          <div className="relative size-72">
            <Image src={tier.image} alt={tier.name} fill />
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs">
            <Globe className="size-4" />
            {origin}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleShare}>
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
