"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type BackButtonProps = React.ComponentProps<"button">;

export const BackButton = ({ className, ...props }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant={"ghost"}
      size="sm"
      className={cn("mt-2 ml-2 self-start", className)}
      {...props}
    >
      <ChevronLeft /> Back
    </Button>
  );
};
