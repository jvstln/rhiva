"use client";

import { ChevronRight, Sparkles } from "lucide-react";

import { ClaimRewardsDialog } from "./ClaimRewardsDialog";

// TODO: derive from the rewards API once pending draws are exposed.
// The banner only renders when this is > 0.
type ClaimRewardsBannerProps = {
  pendingDraws?: number;
};

export const ClaimRewardsBanner = ({
  pendingDraws = 3,
}: ClaimRewardsBannerProps) => {
  if (pendingDraws <= 0) return null;

  return (
    <ClaimRewardsDialog draws={pendingDraws}>
      <button
        type="button"
        data-require-auth
        aria-label={`Claim ${pendingDraws} pending reward draws`}
        className="group flex w-full shrink-0 items-center justify-center gap-2 px-4 py-2 text-center font-medium text-sm shadow-md transition-[filter] hover:brightness-110"
        style={{
          background: "linear-gradient(160deg, #E3B872, #B47B2E)",
          color: "#1A1208",
        }}
      >
        <Sparkles className="size-4 shrink-0" />
        <span>
          You have&nbsp;
          <span className="font-bold">
            {pendingDraws} reward draw{pendingDraws > 1 ? "s" : ""}
          </span>
          &nbsp;waiting — open your reward vault to claim
        </span>
        <ChevronRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </button>
    </ClaimRewardsDialog>
  );
};
