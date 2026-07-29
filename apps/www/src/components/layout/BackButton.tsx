"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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
