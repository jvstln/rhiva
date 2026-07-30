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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { NetworkSolana } from "@web3icons/react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const TOKEN_ITEMS = [{ value: "SOL", icon: NetworkSolana }];

export function SendDialog({
  open,
  onOpenChange,
  children,
}: React.ComponentProps<typeof Dialog> & { children?: React.ReactElement }) {
  const [sendAmount, setSendAmount] = React.useState("0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send</DialogTitle>
        </DialogHeader>

        <div className="relative flex justify-between">
          <div className="flex flex-col">
            <AmountInput value={sendAmount} onValueChange={setSendAmount} />
            <span className="text-muted-foreground">$0.00</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center rounded-sm bg-primary/10 p-1">
              Max
            </div>
            <span className="text-muted-foreground">0.00 SOL</span>
          </div>
        </div>

        <Field>
          <FieldLabel>Token</FieldLabel>
          <Select defaultValue={TOKEN_ITEMS[0]}>
            <SelectTrigger>
              <SelectValue>
                {(item: (typeof TOKEN_ITEMS)[number]) => (
                  <div className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.value}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TOKEN_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item}>
                    <item.icon />
                    <span className="text-muted-foreground">{item.value}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Recipient</FieldLabel>
          <Input placeholder="Paste address" />
        </Field>

        <DialogFooter>
          <Button className="w-full">Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AmountInput({
  value: controlledValue,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
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
