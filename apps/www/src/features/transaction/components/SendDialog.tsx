"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUserApi } from "@/hooks";
import type { WalletWithMetadata } from "@privy-io/react-auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, type SendInput, type SendOutput } from "../transaction.schema";
import { toast } from "sonner";
import { TokenSelect } from "./TokenSelect";

export function SendDialog({
  activeWallet,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  activeWallet: WalletWithMetadata;
  children?: React.ReactElement;
}) {
  const userApi = useUserApi();

  const form = useForm<SendInput, unknown, SendOutput>({
    defaultValues: {
      amount: 0,
      recipient: "",
    },
    resolver: zodResolver(Send),
  });

  const handleSubmit = async (values: SendOutput) => {
    if (!userApi) {
      toast.error("User API not initialized. Please try again.");
      return;
    }

    try {
      const decimals = values.token.info.tokenAmount.decimals;
      const baseUnits = BigInt(
        Math.floor(values.amount * Math.pow(10, decimals)),
      ).toString();

      const response = await userApi.transaction.action.transfer({
        mint: values.token.info.mint,
        recipient: values.recipient,
        amount: baseUnits,
        feeConfig: { maxFee: 0.01 },
      });

      toast.success(
        `Transfer initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
      );
    } catch (err) {
      console.error(err);
      toast.error(
        `Transfer failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send</DialogTitle>
        </DialogHeader>

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <div className="relative flex justify-between">
                <div className="flex flex-col">
                  <AmountInput
                    {...field}
                    value={String(field.value)}
                  />
                  <span className="text-muted-foreground">$0.00</span>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    data-active
                    onClick={() => {
                      field.onChange(
                        form.getValues("token").info.tokenAmount.uiAmount,
                      );
                    }}
                  >
                    Max
                  </Button>
                  <Controller
                    name="token"
                    control={form.control}
                    render={({ field }) => (
                      <span className="text-muted-foreground">
                        {field.value?.info.tokenAmount.uiAmount} SOL
                      </span>
                    )}
                  />
                </div>
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="token"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Token</FieldLabel>
              <TokenSelect
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              />

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="recipient"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Recipient</FieldLabel>
              <Input
                {...field}
                placeholder="Paste address"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
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
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AmountInput({
  value: controlledValue,
  onValueChange,
}: Input.Props & {
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState("0");
  const ghostRef = React.useRef<HTMLSpanElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const value = controlledValue ?? internalValue;

  React.useEffect(() => {
    value;
    if (ghostRef.current && inputRef.current) {
      inputRef.current.style.width = `${ghostRef.current.offsetWidth + 4}px`;
    }
  }, [value]);

  return (
    <div className="flex w-fit items-baseline gap-2.5 self-start">
      <span
        ref={ghostRef}
        className="invisible absolute whitespace-pre font-[inherit] text-4xl"
        aria-hidden="true"
      >
        {value || "0"}
      </span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          const parsedValue = e.target.value.replace(/[^0-9.]/g, "");
          onValueChange?.(parsedValue);
          setInternalValue(parsedValue);
        }}
        className="border-0 bg-transparent text-right text-4xl outline-0"
      />
      <span className="text-muted-foreground">SOL</span>
    </div>
  );
}
