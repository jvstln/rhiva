import { toast } from "sonner";
import { useFormik } from "formik";
import { useEffect } from "react";
import { object, string } from "yup";
import type UserAPI from "@rhivadotfun/userapi";
import type { WalletWithMetadata } from "@privy-io/react-auth";
import { ArrowLeft, ArrowDownLeft, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { ParsedTokenAccount } from "@/queries";
import { Field, FieldLabel } from "@/components/ui/field";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WithdrawViewProps {
  userApi: UserAPI;
  linkedWallets: WalletWithMetadata[];
  balances?: ParsedTokenAccount[];
  onBack: () => void;
  onClose: () => void;
}

export default function WithdrawView({
  userApi,
  linkedWallets = [],
  balances = [],
  onBack,
  onClose,
}: WithdrawViewProps) {
  const defaultToken = balances[0] || null;

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
      selectedToken: defaultToken,
      destination: linkedWallets[0]?.address || "",
    },
    enableReinitialize: true,
    validationSchema: object().shape({
      selectedToken: object().nullable().required("Select a token"),
      destination: string().required("Destination address is required"),
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
        const response = await userApi.transaction.action.transfer({
          mint: values.selectedToken.info.mint,
          recipient: values.destination,
          amount: undefined, // amount is optional -> triggers full balance transfer on server
          feeConfig: { maxFee: 0.01 },
        });

        toast.success(
          `Withdrawal initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
        );
        onClose();
      } catch (err) {
        console.error(err);
        toast.error(
          `Withdrawal failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Ensure default destination is updated if linkedWallets becomes available/changes
  useEffect(() => {
    if (linkedWallets.length > 0 && !values.destination) {
      setFieldValue("destination", linkedWallets[0].address);
    }
  }, [linkedWallets, values.destination, setFieldValue]);

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
          <DialogTitle>Withdraw Token</DialogTitle>
        </div>
      </DialogHeader>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 py-3"
      >
        <div className="space-y-2">
          <p className="font-medium text-muted-foreground text-xs">
            Select Token to Withdraw (Full Balance):
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
                  {balance.metadata?.symbol}
                </span>
                <span className="text-[10px] opacity-75">
                  {balance.metadata?.name}
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
            Destination Address
          </FieldLabel>
          <Input
            name="destination"
            placeholder="Enter Solana Address"
            value={values.destination}
            onChange={(event) =>
              setFieldValue("destination", event.target.value)
            }
            className="rounded-lg"
            disabled={isSubmitting}
          />
          {errors.destination && touched.destination && (
            <p className="text-destructive text-xs">{errors.destination}</p>
          )}
        </Field>
        {linkedWallets && linkedWallets.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-xs">
              Or withdraw to a linked account:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {linkedWallets.map((wallet) => (
                <button
                  type="button"
                  key={wallet.address}
                  onClick={() => setFieldValue("destination", wallet.address)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border bg-card p-3 text-left text-xs transition-all duration-200 hover:bg-accent",
                    values.destination.toLowerCase() ===
                      wallet.address.toLowerCase()
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-muted-foreground" />
                    <span className="font-medium capitalize">
                      {wallet.walletClientType || "External Wallet"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-6"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <span>
              <ArrowDownLeft className="size-4" />
              Withdraw All {values.selectedToken?.metadata?.symbol}
            </span>
          )}
        </Button>
      </form>
    </>
  );
}
