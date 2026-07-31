import type { ParsedTokenAccount } from "@/queries";
import z from "zod";

export const TokenAccount = z.custom<ParsedTokenAccount>();
// .pipe(
//   z.object({
//     info: z.object({ mint: z.string() }),
//     metadata: z.record(z.enum(["mint", "image", "name", "symbol"]), z.string()),
//   }),
// );

const Amount = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val))
  .pipe(z.number().gt(0, "Amount must be greater than zero"));

export const Send = z
  .object({
    token: TokenAccount,
    recipient: z.string().min(1, "Recipient address is required"),
    amount: Amount,
  })
  .refine(
    (value) => {
      const maxAmount = value.token.info.tokenAmount.uiAmount;
      if (value.amount > maxAmount) return false;
      return true;
    },
    { error: "Amount must be less than or equal to max amount" },
  );

export type SendInput = z.input<typeof Send>;
export type SendOutput = z.infer<typeof Send>;

export const Withdraw = z
  .object({
    token: TokenAccount,
    amount: Amount.optional(),
    destination: z.string().min(1, "Recipient address is required"),
  })
  .refine(
    (value) => {
      if (typeof value.amount !== "number") return true;

      const maxAmount = value.token.info.tokenAmount.uiAmount;
      if (value.amount > maxAmount) return false;
      return true;
    },
    { error: "Amount must be less than or equal to max amount" },
  );

export type WithdrawInput = z.input<typeof Withdraw>;
export type WithdrawOutput = z.infer<typeof Withdraw>;

export const Swap = z
  .object({
    action: z.enum(["buy", "sell"]).default("sell"),
    inputAmount: Amount.optional(),
    outputAmount: Amount.optional(),
    slippage: z.coerce.number().optional(),
    inputToken: TokenAccount,
    outputToken: TokenAccount,
  })
  .refine(
    (value) => {
      if (typeof value.inputAmount !== "number") return true;

      const maxAmount = value.inputToken.info.tokenAmount.uiAmount;
      if (value.inputAmount > maxAmount) return false;
      return true;
    },
    { error: "Amount must be less than or equal to max amount" },
  );

export type SwapInput = z.input<typeof Swap>;
export type SwapOutput = z.infer<typeof Swap>;
