"use client";

import * as React from "react";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivy, type WalletWithMetadata } from "@privy-io/react-auth";

import { cn } from "@/lib/utils";
import { useUserApi } from "@/hooks";
import { TokenSelect } from "./TokenSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Withdraw,
  type WithdrawInput,
  type WithdrawOutput,
} from "../transaction.schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WithdrawDialog({
  activeWallet,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  activeWallet: WalletWithMetadata;
  children?: React.ReactElement;
}) {
  const userApi = useUserApi();
  const { user } = usePrivy();

  const form = useForm<WithdrawInput, unknown, WithdrawOutput>({
    defaultValues: {
      destination: "",
    },
    resolver: zodResolver(Withdraw),
  });

  const linkedWallets = user?.linkedAccounts?.filter(
    (account) =>
      account.type === "wallet" &&
      account.address?.toLowerCase() !== activeWallet?.address?.toLowerCase(),
  ) as WalletWithMetadata[];

  // Ensure default destination is updated if linkedWallets becomes available/changes
  const destination = form.watch("destination");
  React.useEffect(() => {
    if (linkedWallets.length > 0 && !destination) {
      form.setValue("destination", linkedWallets[0].address);
    }
  }, [linkedWallets, destination, form.setValue]);

  const handleSubmit = async (values: WithdrawOutput) => {
    if (!userApi) {
      toast.error("User API not initialized. Please try again.");
      return;
    }

    try {
      const response = await userApi.transaction.action.transfer({
        mint: values.token.info.mint,
        recipient: values.destination,
        amount: undefined, // amount is optional -> triggers full balance transfer on server
        feeConfig: { maxFee: 0.01 },
      });

      toast.success(
        `Withdrawal initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
      );
    } catch (err) {
      console.error(err);
      toast.error(
        `Withdrawal failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw</DialogTitle>
        </DialogHeader>

        <Controller
          name="token"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="font-medium text-muted-foreground text-xs">
                Select Token to Withdraw (Full Balance):
              </FieldLabel>
              <TokenSelect
                value={field.value}
                onValueChange={field.onChange}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="destination"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Field>
                <FieldLabel className="font-medium text-sm">
                  Destination Address
                </FieldLabel>
                <Input
                  placeholder="Enter Solana Address"
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
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
                        onClick={() =>
                          form.setValue("destination", wallet.address)
                        }
                        className={cn(
                          "flex items-center justify-between rounded-lg border bg-card p-3 text-left text-xs transition-all duration-200 hover:bg-accent",
                          field.value.toLowerCase() ===
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
                          {wallet.address.slice(0, 6)}...
                          {wallet.address.slice(-4)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        />

        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => {
              form.handleSubmit(handleSubmit)();
            }}
            loading={form.formState.isSubmitting}
          >
            Withdraw all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
