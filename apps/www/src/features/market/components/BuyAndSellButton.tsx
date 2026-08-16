import { Button } from "@/components/ui/button";
import { useSwap } from "@/features/transaction/hooks/use-swap";
import { cn } from "@/lib";
import type { TokenDetail } from "@rhivadotfun/dataapi";
import { Coins, Zap } from "lucide-react";
import { toast } from "sonner";

export const BuyAndSellButton = ({
  value,
  type,
  token,
  className,
  onClick,
  children,
  ...props
}: Omit<Button.Props, "value" | "type"> & {
  type: "buy" | "sell";
  value?: number | null;
  token: TokenDetail;
  icon?: React.ReactNode;
}) => {
  const swap = useSwap();

  if (value === undefined || value === null) return null;

  return (
    <Button
      size="sm"
      variant={"soft"}
      data-require-auth
      className={cn(
        "[&_svg:not([class*=fill])]:fill-current",
        type === "sell" && "[--accent:var(--color-sell)]",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          if (!value) {
            return toast.error(
              "Amount must be greater than zero. Check your settings",
            );
          }

          if (type === "buy") {
            swap.mutate({
              action: "buy",
              outputMint: token.mint,
              amount: value,
            });
          } else if (type === "sell") {
            swap.mutate({
              action: "sell",
              inputMint: token.mint,
              inputDecimals: token.decimals,
              amount: value,
            });
          }
        }
        e.stopPropagation();
        e.preventDefault();
      }}
      {...props}
    >
      {type === "buy" ? <Zap /> : <Coins className="fill-none" />}

      <span className={cn(value > 0 && "group-hover/button:hidden")}>
        {(children ?? type === "buy") ? "Buy" : "Sell"}
      </span>

      {value ? (
        <span className={cn(value > 0 && "hidden group-hover/button:inline")}>
          {value} {type === "buy" ? "SOL" : "%"}
        </span>
      ) : null}
    </Button>
  );
};
