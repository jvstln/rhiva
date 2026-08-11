import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib";
import { buttonVariants } from "../ui/button";
import { useRewardProfile } from "@/features/reward/reward.hook";

export default function RewardButton() {
  const { data } = useRewardProfile();

  return (
    data && (
      <Link
        href="/rewards"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "hidden border-primary sm:flex",
        )}
      >
        {data.xp} XP
      </Link>
    )
  );
}
