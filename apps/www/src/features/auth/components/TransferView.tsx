import { toast } from "sonner";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import type UserAPI from "@rhivadotfun/userapi";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ParsedTokenAccount } from "@/queries";
import { Field, FieldLabel } from "@/components/ui/field";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TransferViewProps {
  userApi: UserAPI;
  balances?: ParsedTokenAccount[];
  onBack: () => void;
  onClose: () => void;
}

export default function TransferView({
  userApi,
  balances = [],
  onBack,
  onClose,
}: TransferViewProps) {
  const {
    values,
    touched,
    errors,
    isValid,
    isSubmitting,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues: {
      selectedToken: balances[0] || null,
      recipient: "",
      amount: "",
    },
    validationSchema: object().shape({
      selectedToken: object().nullable().required("Select a token"),
      recipient: string().required("Recipient address is required"),
      amount: number()
        .typeError("Amount must be a number")
        .positive("Enter a valid positive amount")
        .required("Amount is required")
        .test("max-balance", "Insufficient balance", function (value) {
          const { selectedToken } = this.parent;
          if (!selectedToken || value === undefined) return true;
          const maxAmount = selectedToken.info?.tokenAmount?.uiAmount;
          return maxAmount !== undefined ? value <= maxAmount : true;
        }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!userApi) {
        toast.error("User API not initialized. Please try again.");
        return;
      }
      if (!values.selectedToken) {
        toast.error("Please select a token");
        return;
      }

      try {
        const amountNum = parseFloat(values.amount);
        const decimals = values.selectedToken.info.tokenAmount.decimals;
        const baseUnits = BigInt(
          Math.floor(amountNum * Math.pow(10, decimals)),
        ).toString();

        const response = await userApi.transaction.action.transfer({
          mint: values.selectedToken.info.mint,
          recipient: values.recipient,
          amount: baseUnits,
          feeConfig: { maxFee: 0.01 },
        });

        toast.success(
          `Transfer initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
        );
        onClose();
      } catch (err) {
        console.error(err);
        toast.error(
          `Transfer failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-8 rounded-full"
            type="button"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle>Transfer Tokens</DialogTitle>
        </div>
      </DialogHeader>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 py-3"
      >
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs">
            Select Token:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {balances.map((balance) => (
              <button
                type="button"
                key={balance.info.mint}
                onClick={() => setFieldValue("selectedToken", balance)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200",
                  values.selectedToken?.info.mint === balance.info.mint
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="font-bold text-sm">
                  {balance.metadata?.symbol || "Unknown"}
                </span>
                <span className="text-[10px] opacity-75">
                  {balance.metadata?.name || "Unknown Token"}
                </span>
              </button>
            ))}
          </div>
          {errors.selectedToken && touched.selectedToken && (
            <p className="text-destructive text-xs">
              {String(errors.selectedToken)}
            </p>
          )}
        </div>
        <Field>
          <FieldLabel className="font-medium text-sm">
            Recipient Address
          </FieldLabel>
          <Input
            name="recipient"
            placeholder="Enter Solana Address"
            value={values.recipient}
            onChange={(event) => setFieldValue("recipient", event.target.value)}
            className="rounded-lg"
            disabled={isSubmitting}
          />
          {errors.recipient && touched.recipient && (
            <p className="text-destructive text-xs">{errors.recipient}</p>
          )}
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel className="font-medium text-sm">Amount</FieldLabel>
            {values.selectedToken && (
              <button
                type="button"
                onClick={() =>
                  setFieldValue(
                    "amount",
                    values.selectedToken!.info.tokenAmount.uiAmount,
                  )
                }
                className="text-primary text-xs hover:underline"
              >
                Max
              </button>
            )}
          </div>
          <Input
            name="amount"
            type="number"
            step="any"
            placeholder="0.0"
            value={values.amount}
            onChange={(event) => setFieldValue("amount", event.target.value)}
            className="rounded-lg"
            disabled={isSubmitting}
          />
          {errors.amount && touched.amount && (
            <p className="text-destructive text-xs">{errors.amount}</p>
          )}
        </Field>

        <Button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-6"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <>
              <ArrowUpRight className="size-4" />
              <span>Send {values.selectedToken?.metadata?.symbol}</span>
            </>
          )}
        </Button>
      </form>
    </>
  );
}
