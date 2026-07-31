"use client";

import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Controller, useForm } from "react-hook-form";
import { TokenSelect } from "./TokenSelect";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Swap, type SwapInput, type SwapOutput } from "../transaction.schema";
import { useSwap } from "@/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SwapDialog({
  children,
  ...props
}: Dialog.Props & { children?: React.ReactElement }) {
  const swap = useSwap();

  const form = useForm<SwapInput, unknown, SwapOutput>({
    defaultValues: {
      action: "sell",
      inputAmount: "",
      outputAmount: "",
    },
    resolver: zodResolver(Swap),
  });

  const action = form.watch("action");

  const handleSubmit = async (values: SwapOutput) => {
    if (!values.inputAmount || !values.outputAmount) {
      return toast.error("Amount greater than zero is required");
    }

    swap.mutate(
      {
        action: values.action,
        inputMint: values.inputToken.info.mint,
        inputDecimals: values.inputToken.info.tokenAmount.decimals,
        outputMint: values.outputToken.info.mint,
        amount:
          values.action === "buy" ? values.inputAmount : values.outputAmount,
      },
      {
        onSuccess(response) {
          toast.success(
            `Swap initiated successfully! Signature: ${response.signature.slice(0, 8)}...`,
          );
        },
      },
    );
  };

  return (
    <Dialog {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap</DialogTitle>
        </DialogHeader>

        <div className="relative flex flex-col gap-2">
          {/* Sell Card */}
          <FieldSet
            className={cn(
              "rounded-xl border bg-muted/20 p-4",
              action === "sell" &&
                "border-primary bg-primary/3 transition-colors **:data-[slot=field-legend]:text-primary",
            )}
            onFocus={() => form.setValue("action", "sell")}
          >
            <FieldContent className="flex flex-row items-center justify-between">
              <FieldLegend className="text-lg">Sell</FieldLegend>
              <ToggleGroup
                onValueChange={([value]) => {
                  const token = form.getValues("inputToken");
                  if (!Number(value) || !token) return;

                  form.setValue(
                    "inputAmount",
                    token.info.tokenAmount.uiAmount * (Number(value) / 100),
                  );
                }}
              >
                {[25, 50, 75, 100].map((value) => (
                  <ToggleGroupItem value={String(value)} key={value}>
                    {value}%
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FieldContent>

            <FieldGroup className="flex flex-row items-start justify-between **:data-[slot=select-trigger]:w-fit">
              <Controller
                name="inputToken"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <TokenSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                    {field.value && (
                      <div className="mt-3 flex justify-between font-semibold text-b-4 text-muted-foreground">
                        <span>
                          Balance: ${field.value.info.tokenAmount.uiAmount}
                        </span>
                      </div>
                    )}
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="inputAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <InputGroupInput
                      {...field}
                      placeholder="0"
                      className="text-right text-h4"
                    />
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-right"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          {/* Swap Direction Button */}
          <Button
            variant="outline"
            size="icon"
            className="-translate-1/2 pointer-events-none absolute top-1/2 left-1/2 z-10 bg-background opacity-100!"
            disabled
          >
            <ArrowDownUp />
          </Button>

          {/* Buy Card */}
          <FieldSet
            className={cn(
              "rounded-xl border bg-muted/20 p-4",
              action === "buy" &&
                "border-primary bg-primary/3 transition-colors **:data-[slot=field-legend]:text-primary",
            )}
            onFocus={() => form.setValue("action", "buy")}
          >
            <FieldContent>
              <FieldLegend className="text-lg">Buy</FieldLegend>
            </FieldContent>

            <FieldGroup className="flex flex-row items-start justify-between **:data-[slot=select-trigger]:w-fit">
              <Controller
                name="outputToken"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <TokenSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                    {field.value && (
                      <div className="mt-3 flex justify-between font-semibold text-b-4 text-muted-foreground">
                        <span>
                          Balance: ${field.value.info.tokenAmount.uiAmount}
                        </span>
                      </div>
                    )}
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="outputAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <InputGroupInput
                      {...field}
                      placeholder="0"
                      className="text-right text-h4"
                    />
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-right"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={form.handleSubmit(handleSubmit)}
            loading={form.formState.isSubmitting || swap.isPending}
          >
            Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
